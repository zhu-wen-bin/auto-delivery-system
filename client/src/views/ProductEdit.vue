<template>
  <div class="product-edit-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button link @click="handleBack" class="back-btn">
          <el-icon><ArrowLeft /></el-icon>
          返回列表
        </el-button>
        <h1 class="page-title">{{ isEdit ? '编辑商品' : '添加商品' }}</h1>
        <p class="page-subtitle">
          {{ isEdit ? '修改商品信息、库存和价格设置' : '创建新商品，配置发货方式和库存' }}
        </p>
      </div>
    </div>

    <!-- 表单区域 -->
    <el-card class="form-card" shadow="never" v-loading="loading">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        class="product-form"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入商品名称"
            maxlength="100"
            show-word-limit
            clearable
          />
        </el-form-item>

        <el-form-item label="所属分站" prop="site_code">
          <el-input
            v-model="form.site_code"
            placeholder="请输入分站编码，如 MAIN"
            maxlength="20"
            clearable
          />
        </el-form-item>

        <el-form-item label="发货类型" prop="delivery_type">
          <el-select v-model="form.delivery_type" placeholder="请选择发货类型" style="width: 100%">
            <el-option label="网盘发货" value="netdisk">
              <el-icon style="margin-right: 8px; vertical-align: middle;"><Link /></el-icon>
              <span>网盘发货</span>
            </el-option>
            <el-option label="手动发货" value="manual">
              <el-icon style="margin-right: 8px; vertical-align: middle;"><User /></el-icon>
              <span>手动发货</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="发货内容" prop="delivery_content">
          <el-input
            v-model="form.delivery_content"
            type="textarea"
            :rows="4"
            placeholder="请输入发货内容，如网盘链接和提取码，或手动发货的说明"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="库存数量" prop="stock">
          <div class="stock-input-wrapper">
            <el-input-number
              v-model="form.stock"
              :min="-1"
              :step="1"
              step-strictly
              controls-position="right"
              style="width: 180px"
            />
            <el-tooltip content="-1 表示无限库存，0 表示售罄" placement="right">
              <el-icon class="stock-tip-icon"><InfoFilled /></el-icon>
            </el-tooltip>
          </div>
          <div class="stock-hint">
            <el-tag v-if="form.stock === -1" type="primary" size="small" round>无限库存</el-tag>
            <el-tag v-else-if="form.stock === 0" type="danger" size="small" round>已售罄</el-tag>
            <el-tag v-else type="success" size="small" round>库存 {{ form.stock }}</el-tag>
          </div>
        </el-form-item>

        <el-form-item label="商品价格" prop="price">
          <el-input-number
            v-model="form.price"
            :precision="2"
            :min="0"
            :step="0.1"
            controls-position="right"
            style="width: 180px"
          >
            <template #prefix>
              <span class="price-prefix">¥</span>
            </template>
          </el-input-number>
        </el-form-item>

        <el-form-item label="商品状态" prop="status">
          <el-switch
            v-model="form.status"
            active-value="active"
            inactive-value="disabled"
            active-text="已启用"
            inactive-text="已禁用"
            inline-prompt
            style="--el-switch-on-color: #10b981; --el-switch-off-color: #94a3b8"
          />
        </el-form-item>

        <el-form-item>
          <div class="form-actions">
            <el-button type="primary" size="large" @click="handleSubmit" :loading="submitting">
              <el-icon><Check /></el-icon>
              保存商品
            </el-button>
            <el-button size="large" @click="handleBack">
              <el-icon><Close /></el-icon>
              取消
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft,
  Link,
  User,
  InfoFilled,
  Check,
  Close
} from '@element-plus/icons-vue'
import { getProduct, createProduct, updateProduct } from '../api/products'

const route = useRoute()
const router = useRouter()
const formRef = ref(null)

// 判断是否为编辑模式
const isEdit = computed(() => !!route.params.id)
const productId = computed(() => route.params.id)

// 加载状态
const loading = ref(false)
const submitting = ref(false)

// 表单数据
const form = reactive({
  name: '',
  site_code: '',
  delivery_type: 'netdisk',
  delivery_content: '',
  stock: -1,
  price: 0,
  status: 'active'
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  site_code: [
    { required: true, message: '请输入所属分站', trigger: 'blur' },
    { max: 20, message: '最多 20 个字符', trigger: 'blur' }
  ],
  delivery_type: [
    { required: true, message: '请选择发货类型', trigger: 'change' }
  ],
  delivery_content: [
    { max: 500, message: '最多 500 个字符', trigger: 'blur' }
  ],
  stock: [
    { required: true, message: '请输入库存数量', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入商品价格', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择商品状态', trigger: 'change' }
  ]
}

// 获取商品详情
const fetchProductDetail = async () => {
  if (!isEdit.value) return
  
  loading.value = true
  try {
    const res = await getProduct(productId.value)
    // 后端返回格式: { success: true, product: {...} }
    const product = res.product || res
    // 填充表单数据
    Object.assign(form, {
      name: product.name || '',
      site_code: product.site_code || '',
      delivery_type: product.delivery_type || 'netdisk',
      delivery_content: product.delivery_content || '',
      stock: product.stock !== undefined ? product.stock : -1,
      price: product.price !== undefined ? product.price : 0,
      status: product.status || 'active'
    })
  } catch (error) {
    console.error('获取商品详情失败:', error)
    ElMessage.error('获取商品详情失败')
    router.push('/products')
  } finally {
    loading.value = false
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid, fields) => {
    if (!valid) {
      console.log('表单验证失败:', fields)
      return
    }
    
    submitting.value = true
    try {
      const data = {
        name: form.name,
        site_code: form.site_code,
        delivery_type: form.delivery_type,
        delivery_content: form.delivery_content,
        stock: form.stock,
        price: form.price,
        status: form.status
      }
      
      if (isEdit.value) {
        await updateProduct(productId.value, data)
        ElMessage.success('商品更新成功')
      } else {
        await createProduct(data)
        ElMessage.success('商品创建成功')
      }
      
      router.push('/products')
    } catch (error) {
      console.error('保存失败:', error)
      ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
    } finally {
      submitting.value = false
    }
  })
}

// 返回列表
const handleBack = () => {
  router.push('/products')
}

// 页面加载时获取数据
onMounted(() => {
  fetchProductDetail()
})
</script>

<style scoped>
.product-edit-page {
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f1f5f9;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.back-btn {
  align-self: flex-start;
  padding: 0;
  font-size: 14px;
  color: #64748b;
  margin-bottom: 4px;
}

.back-btn:hover {
  color: #6366f1;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.page-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.form-card {
  border-radius: 12px;
  padding: 20px;
}

.product-form {
  max-width: 600px;
  margin: 0 auto;
}

.stock-input-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stock-tip-icon {
  color: #94a3b8;
  font-size: 16px;
  cursor: help;
}

.stock-tip-icon:hover {
  color: #6366f1;
}

.stock-hint {
  margin-top: 8px;
}

.form-actions {
  display: flex;
  gap: 16px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
}

.price-prefix {
  color: #64748b;
  font-weight: 500;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #475569;
}

:deep(.el-input__wrapper),
:deep(.el-textarea__inner) {
  border-radius: 8px;
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
}

:deep(.el-button--primary:hover) {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.45);
  transform: translateY(-1px);
}

:deep(.el-switch__label) {
  font-weight: 500;
}

:deep(.el-select .el-input__wrapper) {
  border-radius: 8px;
}
</style>
