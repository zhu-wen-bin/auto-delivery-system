<template>
  <div class="products-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div>
        <h1 class="page-title">商品管理</h1>
        <p class="page-subtitle">管理您的商品信息、库存和价格</p>
      </div>
      <el-button type="primary" size="large" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        添加商品
      </el-button>
    </div>

    <!-- 搜索/筛选栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="商品名称">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入商品名称关键词"
            clearable
            :prefix-icon="Search"
            @keyup.enter="handleSearch"
            style="width: 280px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><RefreshRight /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card" shadow="never" v-loading="loading">
      <el-table
        :data="productList"
        stripe
        style="width: 100%"
        :header-cell-style="{ background: '#f8fafc' }"
      >
        <el-table-column prop="id" label="ID" width="70" align="center" />
        
        <el-table-column label="商品名称" min-width="180" show-overflow-tooltip>
          <template #default="{ row }">
            <el-link type="primary" @click="handleViewDetail(row)">
              {{ row.name }}
            </el-link>
          </template>
        </el-table-column>
        
        <el-table-column prop="site_code" label="所属分站" width="100" align="center" />
        
        <el-table-column label="发货类型" width="110" align="center">
          <template #default="{ row }">
            <el-tag
              :type="row.delivery_type === 'netdisk' ? 'primary' : 'warning'"
              round
              effect="light"
            >
              {{ row.delivery_type === 'netdisk' ? '网盘发货' : '手动发货' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="库存" width="100" align="center">
          <template #default="{ row }">
            <span v-if="row.stock === -1" class="stock-unlimited">无限</span>
            <span v-else :class="{ 'stock-low': row.stock < 10 }">{{ row.stock }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="价格" width="100" align="center">
          <template #default="{ row }">
            <span class="price-text">{{ formatMoney(row.price) }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag
              :type="row.status === 'active' ? 'success' : 'info'"
              round
              effect="light"
            >
              {{ row.status === 'active' ? '已启用' : '已禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="创建时间" width="160" align="center">
          <template #default="{ row }">
            {{ formatDate(row.created_at) }}
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <el-button
              style="background-color: #fff;"
              type="primary"
              link
              size="small"
              @click="handleCopyLink(row)"
            >
              <el-icon><Link /></el-icon>
              复制链接
            </el-button>
            <el-button
              type="primary"
              link
              size="small"
              @click="handleEdit(row)"
            >
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button
              type="danger"
              link
              size="small"
              @click="handleDelete(row)"
            >
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 空状态 -->
      <el-empty
        v-if="!loading && productList.length === 0"
        description="暂无商品数据"
        :image-size="120"
      >
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          添加第一个商品
        </el-button>
      </el-empty>

      <!-- 分页 -->
      <div class="pagination-wrapper" v-if="total > 0">
        <el-pagination
          :current-page="pagination.page"
          :page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @update:current-page="handlePageChange"
          @update:page-size="handleSizeChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, RefreshRight, Edit, Delete, Link } from '@element-plus/icons-vue'
import { getProducts, deleteProduct } from '../api/products'
import { formatDate, formatMoney } from '../utils/format'

const router = useRouter()

// 加载状态
const loading = ref(false)

// 搜索表单
const searchForm = reactive({
  keyword: ''
})

// 分页信息
const pagination = reactive({
  page: 1,
  pageSize: 20
})

// 数据列表
const productList = ref([])
const total = ref(0)

// 获取商品列表
const fetchProducts = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...(searchForm.keyword && { keyword: searchForm.keyword })
    }
    const res = await getProducts(params)
    productList.value = res.list || []
    total.value = res.total || 0
  } catch (error) {
    console.error('获取商品列表失败:', error)
    ElMessage.error('获取商品列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  fetchProducts()
}

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  pagination.page = 1
  fetchProducts()
}

// 分页大小变化
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.page = 1
  fetchProducts()
}

// 页码变化
const handlePageChange = (page) => {
  pagination.page = page
  fetchProducts()
}

// 添加商品
const handleAdd = () => {
  router.push('/products/add')
}

// 编辑商品
const handleEdit = (row) => {
  router.push(`/products/edit/${row.id}`)
}

// 查看详情
const handleViewDetail = (row) => {
  // 可以扩展为弹窗显示详情
  router.push(`/products/edit/${row.id}`)
}

// 复制链接
const handleCopyLink = async (row) => {
  const link = `${window.location.origin}/h5/product/${row.id}`
  try {
    await navigator.clipboard.writeText(link)
    ElMessage.success('链接已复制到剪贴板')
  } catch (err) {
    console.error('复制失败:', err)
    // 降级方案
    const textarea = document.createElement('textarea')
    textarea.value = link
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    try {
      document.execCommand('copy')
      ElMessage.success('链接已复制到剪贴板')
    } catch (e) {
      ElMessage.error('复制失败，请手动复制')
    }
    document.body.removeChild(textarea)
  }
}

// 删除商品
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除商品 "${row.name}" 吗？此操作不可恢复。`,
    '删除确认',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning',
      confirmButtonClass: 'el-button--danger'
    }
  )
    .then(async () => {
      try {
        await deleteProduct(row.id)
        ElMessage.success('删除成功')
        fetchProducts()
      } catch (error) {
        console.error('删除失败:', error)
        ElMessage.error('删除失败')
      }
    })
    .catch(() => {
      // 用户取消删除
    })
}

// 页面加载时获取数据
onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.products-page {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f1f5f9;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 6px 0;
}

.page-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.search-card {
  margin-bottom: 20px;
  border-radius: 12px;
}

.table-card {
  border-radius: 12px;
  min-height: 500px;
}

.stock-unlimited {
  color: #6366f1;
  font-weight: 500;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stock-low {
  color: #ef4444;
  font-weight: 500;
}

.price-text {
  color: #ef4444;
  font-weight: 600;
  font-size: 14px;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
}

:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-table th.el-table__cell) {
  font-weight: 600;
  font-size: 13px;
  color: #475569;
  background-color: #f8fafc !important;
}

:deep(.el-table .cell) {
  font-size: 14px;
}

:deep(.el-link__inner) {
  font-weight: 500;
}

:deep(.el-tag) {
  font-weight: 500;
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
}

:deep(.el-button--primary:hover) {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
}

:deep(.el-empty) {
  padding: 60px 0;
}
</style>
