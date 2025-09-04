import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'

export default function BasicInfoForm() {
  const { setBasicInfo } = useUser()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      occupation: '',
      dob: '',
      age: '',
      gender: '',
      maritalStatus: '',
      dependents: ''
    }
  })

  const onSubmit = (data) => {
    setBasicInfo(data)
    navigate('/dashboard/portfolio-builder/calculators')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
          <input className="input-field mt-1" {...register('name', { required: true })} placeholder="Enter full name" />
          {errors.name && <p className="text-xs text-red-500 mt-1">Name is required</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Occupation</label>
          <input className="input-field mt-1" {...register('occupation', { required: true })} placeholder="Enter occupation" />
          {errors.occupation && <p className="text-xs text-red-500 mt-1">Occupation is required</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">DOB</label>
          <input type="date" className="input-field mt-1" {...register('dob', { required: true })} />
          {errors.dob && <p className="text-xs text-red-500 mt-1">DOB is required</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Age</label>
          <input type="number" className="input-field mt-1" {...register('age', { required: true, min: 1 })} placeholder="Enter age" />
          {errors.age && <p className="text-xs text-red-500 mt-1">Valid age is required</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
          <select className="input-field mt-1" {...register('gender', { required: true })}>
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <p className="text-xs text-red-500 mt-1">Gender is required</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Marital Status</label>
          <select className="input-field mt-1" {...register('maritalStatus', { required: true })}>
            <option value="">Select status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
          </select>
          {errors.maritalStatus && <p className="text-xs text-red-500 mt-1">Marital status is required</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Dependents</label>
          <input type="number" className="input-field mt-1" {...register('dependents', { required: true, min: 0 })} placeholder="Number of dependents" />
          {errors.dependents && <p className="text-xs text-red-500 mt-1">Dependents are required</p>}
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn-primary">Continue</button>
      </div>
    </form>
  )
}

