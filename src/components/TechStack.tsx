import React from 'react';
import { motion } from 'motion/react';

export function TechStack() {
  const techCategories = [
  {
    category: "Programming",
    skills: [
      { name: "Python", level: 90, icon: "" },
      { name: "C/C++", level: 85, icon: "" },
      { name: "SQL", level: 80, icon: "" }
    ]
  },
  {
    category: "AI & Machine Learning",
    skills: [
      { name: "YOLOv8", level: 90, icon: "" },
      { name: "TensorFlow / TFLite", level: 85, icon: "" },
      { name: "OpenCV", level: 88, icon: "" },
      { name: "Scikit-learn", level: 85, icon: "" }
    ]
  },
  {
    category: "Data Science",
    skills: [
      { name: "Pandas", level: 90, icon: "" },
      { name: "NumPy", level: 85, icon: "" },
      { name: "Matplotlib", level: 80, icon: "" },
      { name: "Power BI", level: 85, icon: "" }
    ]
  },
  {
    category: "Embedded & Tools",
    skills: [
      { name: "ESP32", level: 90, icon: "" },
      { name: "Serial Communication", level: 85, icon: "" },
      { name: "WebSocket", level: 80, icon: "" },
      { name: "Git & Linux", level: 85, icon: "" }
    ]
  }
];


  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Tech Stack
          </h2>
          <p className="text-gray-400 text-lg">
            Technologies and tools I use to build intelligent systems
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {techCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: categoryIndex * 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6 hover:border-purple-400/50 transition-all duration-300"
            >
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                {category.category}
              </h3>
              
              <div className="space-y-4">
                {category.skills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: categoryIndex * 0.2 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-4"
                  >
                    <motion.div
                      whileHover={{ scale: 1.3, rotate: 15 }}
                      className="text-2xl"
                    >
                      {skill.icon}
                    </motion.div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-white font-medium">{skill.name}</span>
                        <span className="text-purple-400 text-sm">{skill.level}%</span>
                      </div>
                      
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: categoryIndex * 0.2 + index * 0.1 + 0.5 }}
                          viewport={{ once: true }}
                          className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}