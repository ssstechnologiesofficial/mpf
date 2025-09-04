import BasicInfoForm from '../components/forms/BasicInfoForm'

export default function PortfolioBuilder() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Portfolio Builder</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Tell us a bit about yourself to personalize your experience.</p>
      </div>
      <BasicInfoForm />
    </div>
  )
}
