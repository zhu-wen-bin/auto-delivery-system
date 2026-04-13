<template>
  <div class="dashboard-container">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-content">
        <h1 class="welcome-title">
          <span class="greeting">你好</span>，
          <span class="username">{{ username }}</span>
          <span class="wave">👋</span>
        </h1>
        <p class="welcome-date">{{ currentDate }}</p>
      </div>
      <div class="quick-actions">
        <el-button type="primary" :icon="Refresh" @click="refreshData" :loading="loading">
          刷新数据
        </el-button>
      </div>
    </div>

    <!-- 统计卡片区域 - 方案B：4个大卡片，每个含3个指标 -->
    <div class="stats-section">
      <el-row :gutter="20">
        <!-- 今日数据 -->
        <el-col :xs="24" :sm="12" :lg="6">
          <div class="stat-group-card" v-loading="loading">
            <div class="stat-group-header">
              <div class="group-icon today-icon">
                <el-icon :size="20"><Sunny /></el-icon>
              </div>
              <span class="group-label">今日数据</span>
            </div>
            <div class="stat-group-body">
              <div class="stat-item">
                <span class="stat-item-label">订单数</span>
                <span class="stat-item-value">{{ stats.today?.orders || 0 }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-item-label">收益</span>
                <span class="stat-item-value highlight">{{ formatMoney(stats.today?.revenue || 0) }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-item-label">访客</span>
                <span class="stat-item-value">{{ stats.today?.visitors || 0 }}</span>
              </div>
            </div>
          </div>
        </el-col>

        <!-- 昨日数据 -->
        <el-col :xs="24" :sm="12" :lg="6">
          <div class="stat-group-card" v-loading="loading">
            <div class="stat-group-header">
              <div class="group-icon yesterday-icon">
                <el-icon :size="20"><Calendar /></el-icon>
              </div>
              <span class="group-label">昨日数据</span>
            </div>
            <div class="stat-group-body">
              <div class="stat-item">
                <span class="stat-item-label">订单数</span>
                <span class="stat-item-value">{{ stats.yesterday?.orders || 0 }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-item-label">收益</span>
                <span class="stat-item-value highlight">{{ formatMoney(stats.yesterday?.revenue || 0) }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-item-label">访客</span>
                <span class="stat-item-value">{{ stats.yesterday?.visitors || 0 }}</span>
              </div>
            </div>
          </div>
        </el-col>

        <!-- 本月数据 -->
        <el-col :xs="24" :sm="12" :lg="6">
          <div class="stat-group-card" v-loading="loading">
            <div class="stat-group-header">
              <div class="group-icon month-icon">
                <el-icon :size="20"><DataLine /></el-icon>
              </div>
              <span class="group-label">本月数据</span>
            </div>
            <div class="stat-group-body">
              <div class="stat-item">
                <span class="stat-item-label">订单数</span>
                <span class="stat-item-value">{{ stats.month?.orders || 0 }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-item-label">收益</span>
                <span class="stat-item-value highlight">{{ formatMoney(stats.month?.revenue || 0) }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-item-label">访客</span>
                <span class="stat-item-value">{{ stats.month?.visitors || 0 }}</span>
              </div>
            </div>
          </div>
        </el-col>

        <!-- 累计数据 -->
        <el-col :xs="24" :sm="12" :lg="6">
          <div class="stat-group-card" v-loading="loading">
            <div class="stat-group-header">
              <div class="group-icon total-icon">
                <el-icon :size="20"><Trophy /></el-icon>
              </div>
              <span class="group-label">累计数据</span>
            </div>
            <div class="stat-group-body">
              <div class="stat-item">
                <span class="stat-item-label">订单数</span>
                <span class="stat-item-value">{{ stats.total?.orders || 0 }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-item-label">收益</span>
                <span class="stat-item-value highlight">{{ formatMoney(stats.total?.revenue || 0) }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-item-label">访客</span>
                <span class="stat-item-value">{{ stats.total?.visitors || 0 }}</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="chart-card" v-loading="loading">
            <div class="chart-header">
              <div class="chart-title">
                <el-icon :size="18" class="chart-icon"><TrendCharts /></el-icon>
                <span>近7天趋势分析</span>
              </div>
              <div class="chart-legend">
                <span class="legend-item">
                  <span class="legend-dot bar"></span>
                  <span>订单数</span>
                </span>
                <span class="legend-item">
                  <span class="legend-dot line"></span>
                  <span>收益 (¥)</span>
                </span>
              </div>
            </div>
            <div ref="chartRef" class="chart-container"></div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 详细指标卡片 -->
    <div class="detail-stats-section">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :lg="8">
          <StatCard
            title="今日转化率"
            :value="conversionRate"
            icon="UserFilled"
            color="emerald"
            :trend="2.5"
            suffix="%"
          />
        </el-col>
        <el-col :xs="24" :sm="12" :lg="8">
          <StatCard
            title="客单价"
            :value="avgOrderValue"
            icon="Money"
            color="amber"
            prefix="¥"
          />
        </el-col>
        <el-col :xs="24" :sm="12" :lg="8">
          <StatCard
            title="日均订单"
            :value="avgDailyOrders"
            icon="ShoppingCart"
            color="rose"
          />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import { 
  Refresh, 
  Sunny, 
  Calendar, 
  DataLine, 
  Trophy,
  TrendCharts,
  UserFilled,
  Money,
  ShoppingCart
} from '@element-plus/icons-vue'
import { getStats } from '../api/dashboard'
import { formatMoney } from '../utils/format'
import StatCard from '../components/StatCard.vue'

// 状态
const loading = ref(false)
const stats = ref({
  today: { orders: 0, revenue: 0, visitors: 0 },
  yesterday: { orders: 0, revenue: 0, visitors: 0 },
  month: { orders: 0, revenue: 0, visitors: 0 },
  total: { orders: 0, revenue: 0, visitors: 0 },
  dailyStats: []
})
const chartRef = ref(null)
let chartInstance = null

// 计算属性
const username = computed(() => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  return userInfo.username || '管理员'
})

const currentDate = computed(() => {
  const date = new Date()
  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const weekDay = weekDays[date.getDay()]
  return `${year}年${month}月${day}日 ${weekDay}`
})

const conversionRate = computed(() => {
  const today = stats.value.today
  if (!today || today.visitors === 0) return '0.00'
  return ((today.orders / today.visitors) * 100).toFixed(2)
})

const avgOrderValue = computed(() => {
  const today = stats.value.today
  if (!today || today.orders === 0) return '0.00'
  return (today.revenue / today.orders).toFixed(2)
})

const avgDailyOrders = computed(() => {
  const dailyStats = stats.value.dailyStats || []
  if (dailyStats.length === 0) return '0'
  const total = dailyStats.reduce((sum, day) => sum + (day.orders || 0), 0)
  return Math.round(total / dailyStats.length)
})

// 方法
const fetchData = async () => {
  loading.value = true
  try {
    const res = await getStats()
    if (res.success) {
      stats.value = {
        today: res.stats?.today || { orders: 0, revenue: 0, visitors: 0 },
        yesterday: res.stats?.yesterday || { orders: 0, revenue: 0, visitors: 0 },
        month: res.stats?.month || { orders: 0, revenue: 0, visitors: 0 },
        total: res.stats?.total || { orders: 0, revenue: 0, visitors: 0 },
        dailyStats: res.dailyStats || []
      }
      nextTick(() => {
        initChart()
      })
    } else {
      ElMessage.error(res.message || '获取数据失败')
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
    ElMessage.error('获取数据失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  fetchData()
  ElMessage.success('数据已刷新')
}

const initChart = () => {
  if (!chartRef.value) return
  
  // 销毁已有实例
  if (chartInstance) {
    chartInstance.dispose()
  }
  
  chartInstance = echarts.init(chartRef.value)
  
  const dailyStats = stats.value.dailyStats || []
  const dates = dailyStats.map(item => {
    const date = new Date(item.date)
    return `${date.getMonth() + 1}/${date.getDate()}`
  })
  const orders = dailyStats.map(item => item.orders || 0)
  const revenues = dailyStats.map(item => item.revenue || 0)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: {
        color: '#1e293b'
      },
      formatter: function(params) {
        let html = `<div style="font-weight:600;margin-bottom:5px">${params[0].axisValue}</div>`
        params.forEach(param => {
          const value = param.seriesName === '收益' ? `¥${param.value.toFixed(2)}` : param.value
          html += `<div style="display:flex;align-items:center;gap:8px;margin:3px 0">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${param.color}"></span>
            <span>${param.seriesName}: <strong>${value}</strong></span>
          </div>`
        })
        return html
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisPointer: {
        type: 'shadow'
      },
      axisLine: {
        lineStyle: {
          color: '#e2e8f0'
        }
      },
      axisLabel: {
        color: '#64748b',
        fontSize: 12
      },
      axisTick: {
        show: false
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '订单数',
        min: 0,
        axisLabel: {
          color: '#64748b',
          fontSize: 12
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: '#f1f5f9',
            type: 'dashed'
          }
        },
        nameTextStyle: {
          color: '#64748b',
          fontSize: 12
        }
      },
      {
        type: 'value',
        name: '收益 (¥)',
        min: 0,
        axisLabel: {
          color: '#64748b',
          fontSize: 12,
          formatter: '¥{value}'
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        nameTextStyle: {
          color: '#64748b',
          fontSize: 12
        }
      }
    ],
    series: [
      {
        name: '订单数',
        type: 'bar',
        data: orders,
        barWidth: '40%',
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#818cf8' },
            { offset: 1, color: '#6366f1' }
          ])
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#a5b4fc' },
              { offset: 1, color: '#818cf8' }
            ])
          }
        },
        animationDuration: 1000,
        animationEasing: 'elasticOut'
      },
      {
        name: '收益',
        type: 'line',
        yAxisIndex: 1,
        data: revenues,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 3,
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#f59e0b' },
            { offset: 1, color: '#fbbf24' }
          ])
        },
        itemStyle: {
          color: '#f59e0b',
          borderWidth: 2,
          borderColor: '#fff'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(245, 158, 11, 0.2)' },
            { offset: 1, color: 'rgba(245, 158, 11, 0)' }
          ])
        },
        animationDuration: 1200,
        animationEasing: 'cubicOut'
      }
    ]
  }
  
  chartInstance.setOption(option)
}

// 窗口大小改变时重新调整图表
const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

// 生命周期
onMounted(() => {
  fetchData()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (chartInstance) {
    chartInstance.dispose()
  }
})
</script>

<style scoped>
.dashboard-container {
  padding: 24px;
  min-height: calc(100vh - 60px);
  background: #f0f2f5;
}

/* 欢迎区域 */
.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 24px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 16px;
  box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.35);
}

.welcome-title {
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.greeting {
  font-weight: 400;
}

.username {
  font-weight: 700;
}

.wave {
  display: inline-block;
  animation: wave 2s ease-in-out infinite;
}

@keyframes wave {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(20deg); }
  75% { transform: rotate(-10deg); }
}

.welcome-date {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin: 8px 0 0 0;
}

.quick-actions :deep(.el-button) {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  backdrop-filter: blur(10px);
}

.quick-actions :deep(.el-button:hover) {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

/* 统计卡片区域 */
.stats-section {
  margin-bottom: 24px;
}

.stat-group-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  height: 100%;
}

.stat-group-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.12);
}

.stat-group-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.group-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.today-icon { background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%); }
.yesterday-icon { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); }
.month-icon { background: linear-gradient(135deg, #10b981 0%, #34d399 100%); }
.total-icon { background: linear-gradient(135deg, #f43f5e 0%, #fb7185 100%); }

.group-label {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.stat-group-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-item-label {
  font-size: 13px;
  color: #64748b;
}

.stat-item-value {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.stat-item-value.highlight {
  color: #6366f1;
  font-weight: 700;
}

/* 图表区域 */
.charts-section {
  margin-bottom: 24px;
}

.chart-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.chart-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.chart-icon {
  color: #6366f1;
}

.chart-legend {
  display: flex;
  gap: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #64748b;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-dot.bar {
  background: linear-gradient(180deg, #818cf8 0%, #6366f1 100%);
}

.legend-dot.line {
  background: #f59e0b;
  border-radius: 50%;
}

.chart-container {
  width: 100%;
  height: 380px;
}

/* 详细指标区域 */
.detail-stats-section {
  margin-bottom: 24px;
}

/* 响应式 */
@media (max-width: 1200px) {
  .chart-container {
    height: 320px;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 16px;
  }
  
  .welcome-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 20px;
  }
  
  .welcome-title {
    font-size: 20px;
  }
  
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .chart-container {
    height: 280px;
  }
  
  .stat-group-card {
    margin-bottom: 16px;
  }
}

/* 加载动画 */
:deep(.el-loading-mask) {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.8);
}
</style>
