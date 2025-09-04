export default function StatCard({ title, value, icon, trend, trendValue, color = 'primary' }) {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-300',
    green: 'bg-green-50 text-green-600 dark:bg-green-900 dark:text-green-300',
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900 dark:text-orange-300'
  }

  const trendClasses = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <svg 
                className={`w-4 h-4 ${trend === 'up' ? 'rotate-0' : 'rotate-180'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className={`ml-1 text-sm font-medium ${trendClasses[trend]}`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
