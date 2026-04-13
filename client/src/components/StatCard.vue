<template>
  <div class="stat-card" :class="[`border-${color}`, { 'has-trend': trend !== undefined }]">
    <div class="card-content">
      <div class="icon-wrapper" :class="`bg-${color}`">
        <el-icon :size="24">
          <component :is="icon" />
        </el-icon>
      </div>
      <div class="info">
        <p class="title">{{ title }}</p>
        <p class="value" :class="{ 'animate': animated }">{{ displayValue }}</p>
        <div v-if="trend !== undefined" class="trend" :class="trend >= 0 ? 'up' : 'down'">
          <el-icon :size="12">
            <ArrowUp v-if="trend >= 0" />
            <ArrowDown v-else />
          </el-icon>
          <span>{{ Math.abs(trend) }}%</span>
          <span class="trend-label">较上期</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: String,
    default: 'TrendCharts'
  },
  color: {
    type: String,
    default: 'indigo',
    validator: (val) => ['indigo', 'emerald', 'amber', 'rose', 'cyan', 'violet'].includes(val)
  },
  trend: {
    type: Number,
    default: undefined
  },
  prefix: {
    type: String,
    default: ''
  },
  suffix: {
    type: String,
    default: ''
  }
})

const animated = ref(false)

const displayValue = computed(() => {
  return `${props.prefix}${props.value}${props.suffix}`
})

onMounted(() => {
  setTimeout(() => {
    animated.value = true
  }, 100)
})
</script>

<style scoped>
.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  transition: width 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stat-card:hover::before {
  width: 6px;
}

/* 边框颜色 */
.border-indigo::before { background: linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%); }
.border-emerald::before { background: linear-gradient(180deg, #10b981 0%, #34d399 100%); }
.border-amber::before { background: linear-gradient(180deg, #f59e0b 0%, #fbbf24 100%); }
.border-rose::before { background: linear-gradient(180deg, #f43f5e 0%, #fb7185 100%); }
.border-cyan::before { background: linear-gradient(180deg, #06b6d4 0%, #22d3ee 100%); }
.border-violet::before { background: linear-gradient(180deg, #8b5cf6 0%, #a78bfa 100%); }

.card-content {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #fff;
  transition: transform 0.3s ease;
}

.stat-card:hover .icon-wrapper {
  transform: scale(1.05) rotate(3deg);
}

/* 图标背景色 */
.bg-indigo { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); }
.bg-emerald { background: linear-gradient(135deg, #10b981 0%, #34d399 100%); }
.bg-amber { background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%); }
.bg-rose { background: linear-gradient(135deg, #f43f5e 0%, #fb7185 100%); }
.bg-cyan { background: linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%); }
.bg-violet { background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%); }

.info {
  flex: 1;
  min-width: 0;
}

.title {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
  margin: 0 0 6px 0;
  letter-spacing: 0.3px;
}

.value {
  font-size: 26px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1.2;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  letter-spacing: -0.5px;
}

.value.animate {
  animation: countUp 0.6s ease-out;
}

@keyframes countUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.trend {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  margin-top: 8px;
  padding: 2px 8px;
  border-radius: 20px;
}

.trend.up {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.trend.down {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.trend-label {
  font-weight: 400;
  color: #94a3b8;
  margin-left: 2px;
}

/* 响应式 */
@media (max-width: 640px) {
  .stat-card {
    padding: 16px;
  }
  
  .icon-wrapper {
    width: 40px;
    height: 40px;
  }
  
  .value {
    font-size: 22px;
  }
  
  .title {
    font-size: 12px;
  }
}
</style>
