// 模拟数据库模块，用于在没有 sqlite3 的环境下验证代码逻辑

// 模拟数据存储
const mockData = {
  users: [
    {
      id: 1,
      username: 'admin',
      password: '$2a$10$YourHashedPasswordHere', // bcrypt hash of 'admin123'
      role: 'admin',
      vip_status: 'none',
      commission_rate: 0,
      balance: 0,
      total_commission: 0,
      status: 'active',
      site_code: 'MAIN',
      created_at: '2026-04-10 12:00:00',
      updated_at: '2026-04-10 12:00:00'
    },
    {
      id: 2,
      username: 'agent1',
      password: '$2a$10$YourHashedPasswordHere',
      role: 'agent',
      vip_status: 'active',
      vip_expire_at: '2027-04-10 12:00:00',
      commission_rate: 30,
      balance: 1500.50,
      total_commission: 2500.00,
      status: 'active',
      site_code: 'AGENT01',
      created_at: '2026-04-10 12:00:00',
      updated_at: '2026-04-10 12:00:00'
    }
  ],
  products: [
    { id: 1, name: '护理述职述廉报告PPT模板', site_code: 'MAIN', delivery_type: 'netdisk', delivery_content: 'https://pan.baidu.com/s/1abc123', stock: 50, price: 15.00, status: 'active', created_at: '2026-04-10 12:00:00', updated_at: '2026-04-10 12:00:00' },
    { id: 2, name: 'ICU谵妄护理PPT课件', site_code: 'MAIN', delivery_type: 'netdisk', delivery_content: 'https://pan.baidu.com/s/1def456', stock: 30, price: 20.00, status: 'active', created_at: '2026-04-10 12:00:00', updated_at: '2026-04-10 12:00:00' },
    { id: 3, name: '支气管哮喘护理个案PPT', site_code: 'MAIN', delivery_type: 'netdisk', delivery_content: 'https://pan.baidu.com/s/1ghi789', stock: 40, price: 12.00, status: 'active', created_at: '2026-04-10 12:00:00', updated_at: '2026-04-10 12:00:00' }
  ],
  orders: [
    { id: 1, order_no: 'ORD202604100001', product_id: 1, product_name: '护理述职述廉报告PPT模板', agent_username: 'agent1', amount: 15.00, status: 'completed', paid_at: '2026-04-10 08:30:00', created_at: '2026-04-10 08:30:00' },
    { id: 2, order_no: 'ORD202604100002', product_id: 2, product_name: 'ICU谵妄护理PPT课件', agent_username: 'agent1', amount: 20.00, status: 'completed', paid_at: '2026-04-10 09:15:00', created_at: '2026-04-10 09:15:00' },
    { id: 3, order_no: 'ORD202604100003', product_id: 1, product_name: '护理述职述廉报告PPT模板', agent_username: null, amount: 15.00, status: 'pending', paid_at: null, created_at: '2026-04-10 10:00:00' },
    { id: 4, order_no: 'ORD202604090001', product_id: 3, product_name: '支气管哮喘护理个案PPT', agent_username: 'agent1', amount: 12.00, status: 'completed', paid_at: '2026-04-09 14:20:00', created_at: '2026-04-09 14:20:00' },
    { id: 5, order_no: 'ORD202604080001', product_id: 2, product_name: 'ICU谵妄护理PPT课件', agent_username: null, amount: 20.00, status: 'completed', paid_at: '2026-04-08 11:00:00', created_at: '2026-04-08 11:00:00' }
  ],
  visitor_logs: [
    { id: 1, site_code: 'MAIN', ip: '192.168.1.1', product_id: 1, product_name: '护理述职述廉报告PPT模板', visit_url: '/product/1', referer_url: 'https://www.google.com', created_at: '2026-04-10 08:00:00' },
    { id: 2, site_code: 'MAIN', ip: '192.168.1.2', product_id: 2, product_name: 'ICU谵妄护理PPT课件', visit_url: '/product/2', referer_url: 'https://www.baidu.com', created_at: '2026-04-10 09:00:00' },
    { id: 3, site_code: 'MAIN', ip: '192.168.1.3', product_id: 1, product_name: '护理述职述廉报告PPT模板', visit_url: '/product/1', referer_url: '', created_at: '2026-04-09 10:00:00' },
    { id: 4, site_code: 'MAIN', ip: '192.168.1.4', product_id: 3, product_name: '支气管哮喘护理个案PPT', visit_url: '/product/3', referer_url: 'https://www.bing.com', created_at: '2026-04-08 15:00:00' }
  ]
};

// 模拟查询构建器
function createQueryBuilder(tableName) {
  let query = {
    _table: tableName,
    _where: [],
    _whereNot: [],
    _select: null,
    _orderBy: null,
    _limit: null,
    _offset: null,
    _count: false,
    _sum: null
  };

  return {
    where(column, operator, value) {
      if (arguments.length === 2) {
        value = operator;
        operator = '=';
      }
      query._where.push({ column, operator, value });
      return this;
    },

    whereNot(column, value) {
      query._whereNot.push({ column, value });
      return this;
    },

    select(...columns) {
      query._select = columns;
      return this;
    },

    orderBy(column, direction = 'asc') {
      query._orderBy = { column, direction };
      return this;
    },

    limit(n) {
      query._limit = n;
      return this;
    },

    offset(n) {
      query._offset = n;
      return this;
    },

    count(column, alias) {
      query._count = { column, alias };
      return this;
    },

    sum(column, alias) {
      query._sum = { column, alias };
      return this;
    },

    first() {
      const results = this._execute();
      return results.length > 0 ? results[0] : null;
    },

    _execute() {
      let data = [...(mockData[tableName] || [])];

      // 应用 where 条件
      query._where.forEach(({ column, operator, value }) => {
        data = data.filter(row => {
          const rowValue = row[column];
          switch (operator) {
            case '=': return rowValue == value;
            case '!=': return rowValue != value;
            case '>': return rowValue > value;
            case '<': return rowValue < value;
            case '>=': return rowValue >= value;
            case '<=': return rowValue <= value;
            case 'like': return rowValue && rowValue.includes(value.replace(/%/g, ''));
            default: return rowValue == value;
          }
        });
      });

      // 应用 whereNot 条件
      query._whereNot.forEach(({ column, value }) => {
        data = data.filter(row => row[column] != value);
      });

      // 应用 count
      if (query._count) {
        const count = data.length;
        const result = {};
        result[query._count.alias || 'count'] = count;
        return [result];
      }

      // 应用 sum
      if (query._sum) {
        const sum = data.reduce((acc, row) => acc + (row[query._sum.column] || 0), 0);
        const result = {};
        result[query._sum.alias || 'sum'] = sum;
        return [result];
      }

      // 应用排序
      if (query._orderBy) {
        const { column, direction } = query._orderBy;
        data.sort((a, b) => {
          if (a[column] < b[column]) return direction === 'asc' ? -1 : 1;
          if (a[column] > b[column]) return direction === 'asc' ? 1 : -1;
          return 0;
        });
      }

      // 应用分页
      if (query._offset) {
        data = data.slice(query._offset);
      }
      if (query._limit) {
        data = data.slice(0, query._limit);
      }

      // 应用 select
      if (query._select) {
        data = data.map(row => {
          const newRow = {};
          query._select.forEach(col => {
            newRow[col] = row[col];
          });
          return newRow;
        });
      }

      return data;
    },

    then(resolve) {
      resolve(this._execute());
    }
  };
}

// 模拟 knex 对象
const mockKnex = (tableName) => createQueryBuilder(tableName);

// 添加 insert 方法
mockKnex.insert = async (data) => {
  const tableName = mockKnex._lastTable;
  if (!mockData[tableName]) {
    mockData[tableName] = [];
  }
  
  if (Array.isArray(data)) {
    data.forEach(item => {
      const id = mockData[tableName].length > 0 
        ? Math.max(...mockData[tableName].map(r => r.id)) + 1 
        : 1;
      item.id = id;
      mockData[tableName].push(item);
    });
  } else {
    const id = mockData[tableName].length > 0 
      ? Math.max(...mockData[tableName].map(r => r.id)) + 1 
      : 1;
    data.id = id;
    mockData[tableName].push(data);
    return [id];
  }
};

// 代理函数来捕获表名
const proxyKnex = new Proxy(mockKnex, {
  apply(target, thisArg, args) {
    mockKnex._lastTable = args[0];
    return target(args[0]);
  }
});

console.log('Mock database connected (for testing purposes)');

module.exports = proxyKnex;
