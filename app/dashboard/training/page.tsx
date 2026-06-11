"use client";

export default function TrainingPage() {
  const courses = [
    { id: 1, name: "AI Basics", progress: 75, students: 234 },
    { id: 2, name: "Claude API", progress: 50, students: 156 },
    { id: 3, name: "Automation", progress: 100, students: 89 }
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-black dark:text-white">Training</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Courses</p>
          <p className="text-3xl font-bold text-black dark:text-white">3</p>
        </div>
        <div className="p-4 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
          <p className="text-3xl font-bold text-black dark:text-white">479</p>
        </div>
        <div className="p-4 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</p>
          <p className="text-3xl font-bold text-black dark:text-white">75%</p>
        </div>
      </div>
      <div className="space-y-2">
        {courses.map((course) => (
          <div key={course.id} className="p-4 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-black dark:text-white">{course.name}</h3>
              <span className="text-sm text-gray-600 dark:text-gray-400">{course.students} students</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded overflow-hidden">
              <div className="h-full bg-black dark:bg-white" style={{ width: `${course.progress}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
