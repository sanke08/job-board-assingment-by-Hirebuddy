import { Briefcase } from 'lucide-react'
import React from 'react'

const Header = () => {
    return (
        <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Briefcase className="h-6 w-6 text-blue-600" />
                        <h1 className="text-xl font-bold text-gray-900">JobBoard Pro</h1>
                    </div>
                    {/* <div className="text-sm text-gray-500">{jobs.length} jobs available</div> */}
                </div>
            </div>
        </header>
    )
}

export default Header
