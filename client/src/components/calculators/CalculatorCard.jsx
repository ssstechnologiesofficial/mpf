export default function CalculatorCard({ id, title, name, description, onStart }) {
  const heading = title || name
  return (
    <div className="card p-6 hover:shadow-lg transition-shadow rounded-xl">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{heading}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300">
          <span className="text-sm font-bold">↗</span>
        </div>
      </div>
      <div className="mt-4">
        <button onClick={() => onStart?.(id)} className="btn-primary">Start</button>
      </div>
    </div>
  )
}
