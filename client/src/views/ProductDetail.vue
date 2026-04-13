<template>
  <div class="h5-product-page">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="back-btn" @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
      </div>
      <h1 class="header-title">商品详情</h1>
      <div class="header-placeholder"></div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="6" animated />
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <el-icon class="error-icon"><Warning /></el-icon>
      <p class="error-text">{{ error }}</p>
      <el-button type="primary" @click="fetchProduct">重新加载</el-button>
    </div>

    <!-- 商品内容 -->
    <template v-else-if="product">
      <!-- 商品封面图 -->
      <div class="product-cover">
        <div class="cover-gradient">
          <span class="cover-text">{{ product.name.charAt(0) }}</span>
        </div>
      </div>

      <!-- 价格区域 -->
      <div class="price-section">
        <div class="price-main">
          <span class="price-symbol">¥</span>
          <span class="price-value">{{ formatPrice(product.price) }}</span>
        </div>
        <div class="price-extra">
          <span class="original-price">¥{{ formatPrice(product.price * 2) }}</span>
          <span class="sold-count">已售 {{ soldCount }}</span>
        </div>
      </div>

      <!-- 商品信息 -->
      <div class="product-info">
        <h2 class="product-name">{{ product.name }}</h2>
        
        <!-- 标签区域 -->
        <div class="tags-section">
          <span class="tag tag-delivery">
            {{ product.delivery_type === 'netdisk' ? '网盘发货' : '自动发货' }}
          </span>
          <span class="tag tag-stock">
            {{ product.stock === -1 ? '库存不限' : `库存 ${product.stock}` }}
          </span>
        </div>
      </div>

      <!-- 购买须知 -->
      <div class="notice-section">
        <div class="notice-title">
          <el-icon><InfoFilled /></el-icon>
          <span>购买须知</span>
        </div>
        <div class="notice-content">
          <p>付款后重新打开页面即可查看发货内容</p>
          <p>如遇到问题请联系客服处理</p>
        </div>
      </div>

      <!-- 底部占位，防止内容被底部栏遮挡 -->
      <div class="bottom-placeholder"></div>
    </template>

    <!-- 底部固定操作栏 -->
    <div class="bottom-bar" v-if="product && !loading && !error">
      <div class="price-display">
        <span class="price-label">合计:</span>
        <span class="price-amount">¥{{ formatPrice(product.price) }}</span>
      </div>
      <button class="buy-btn" @click="handleBuy">
        单独购买
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Warning, InfoFilled } from '@element-plus/icons-vue'
import { getPublicProduct } from '../api/products'
import { createOrder } from '../api/orders'

const route = useRoute()
const router = useRouter()

// 状态
const loading = ref(true)
const error = ref('')
const product = ref(null)
const soldCount = ref(0)

// 格式化价格
const formatPrice = (price) => {
  if (price === undefined || price === null) return '0.00'
  return parseFloat(price).toFixed(2)
}

// 生成随机已售数量
const generateSoldCount = () => {
  return Math.floor(Math.random() * 500) + 50
}

// 获取商品详情
const fetchProduct = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const id = route.params.id
    if (!id) {
      error.value = '商品ID不能为空'
      return
    }
    
    const res = await getPublicProduct(id)
    if (res.success) {
      product.value = res.product
      soldCount.value = generateSoldCount()
    } else {
      error.value = res.message || '获取商品信息失败'
    }
  } catch (err) {
    console.error('获取商品详情失败:', err)
    error.value = '获取商品信息失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 返回
const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    // 如果没有历史记录，可以跳转到首页或其他默认页面
    window.location.href = '/'
  }
}

// 购买
const handleBuy = async () => {
  if (!product.value) return
  
  try {
    const res = await createOrder({ product_id: product.value.id })
    if (res.success) {
      ElMessageBox.alert(
        '购买成功！发货内容将通过网盘链接发送，请留意查收。',
        '下单成功',
        {
          confirmButtonText: '知道了',
          type: 'success',
          center: true
        }
      )
    } else {
      ElMessage.error(res.message || '购买失败')
    }
  } catch (error) {
    console.error('购买失败:', error)
    ElMessage.error('购买失败，请稍后重试')
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchProduct()
})
</script>

<style scoped>
.h5-product-page {
  min-height: 100vh;
  background: #f5f5f5;
  max-width: 480px;
  margin: 0 auto;
  position: relative;
}

/* 顶部导航栏 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.back-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f5f5f5;
  cursor: pointer;
  transition: background 0.2s;
}

.back-btn:hover {
  background: #e8e8e8;
}

.back-btn .el-icon {
  font-size: 18px;
  color: #333;
}

.header-title {
  font-size: 17px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.header-placeholder {
  width: 32px;
}

/* 加载状态 */
.loading-container {
  padding: 20px;
  background: #fff;
}

/* 错误状态 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: #fff;
  min-height: 50vh;
}

.error-icon {
  font-size: 48px;
  color: #909399;
  margin-bottom: 16px;
}

.error-text {
  font-size: 14px;
  color: #606266;
  margin-bottom: 20px;
}

/* 商品封面 */
.product-cover {
  width: 100%;
  aspect-ratio: 16 / 10;
  background: #fff;
  overflow: hidden;
}

.cover-gradient {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-text {
  font-size: 80px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

/* 价格区域 */
.price-section {
  background: #fff;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.price-main {
  display: flex;
  align-items: baseline;
  margin-bottom: 8px;
}

.price-symbol {
  font-size: 18px;
  color: #ff4d4f;
  font-weight: 600;
  margin-right: 2px;
}

.price-value {
  font-size: 32px;
  color: #ff4d4f;
  font-weight: 700;
  line-height: 1;
}

.price-extra {
  display: flex;
  align-items: center;
  gap: 12px;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.sold-count {
  font-size: 13px;
  color: #999;
}

/* 商品信息 */
.product-info {
  background: #fff;
  padding: 16px;
  margin-bottom: 10px;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  line-height: 1.5;
  margin: 0 0 12px 0;
}

.tags-section {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.tag-delivery {
  background: #e6f7ff;
  color: #1890ff;
}

.tag-stock {
  background: #f6ffed;
  color: #52c41a;
}

/* 购买须知 */
.notice-section {
  background: #fff;
  padding: 16px;
  margin-bottom: 10px;
}

.notice-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.notice-title .el-icon {
  color: #1890ff;
  font-size: 16px;
}

.notice-content {
  padding-left: 22px;
}

.notice-content p {
  font-size: 13px;
  color: #666;
  line-height: 1.8;
  margin: 0;
}

/* 底部占位 */
.bottom-placeholder {
  height: 70px;
}

/* 底部固定栏 */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  background: #fff;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
}

.price-display {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.price-label {
  font-size: 14px;
  color: #666;
}

.price-amount {
  font-size: 20px;
  color: #ff4d4f;
  font-weight: 700;
}

.buy-btn {
  flex: 1;
  max-width: 200px;
  margin-left: 16px;
  height: 44px;
  border: none;
  border-radius: 22px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.buy-btn:hover {
  opacity: 0.9;
}

.buy-btn:active {
  opacity: 0.8;
}
</style>
