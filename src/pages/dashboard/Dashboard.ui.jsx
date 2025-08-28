import ConfigurationCard from "@/components/dashboard/ConfigurationCard"
import AnimatedGradientText from "@/components/magicui/animated-gradient-text"
import TypingAnimation from "@/components/magicui/typing-animation"

const DashboardUI = () => {
  return (
    <div className="bg-gradient-to-br p-8">
      <div className="max-w-4xl mx-auto">
        {/* Animated Header Section */}
        <div className="text-center mb-12 space-y-6">
          <AnimatedGradientText
            className="text-3xl font-bold"
            speed={2}
            colorFrom="#6366f1"
            colorTo="#8b5cf6"
          >
            PyAgenity Playground
          </AnimatedGradientText>

          <TypingAnimation
            className="text-sm text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            duration={50}
            delay={1000}
          >
            PyAgenity is a Python framework for building, orchestrating, and
            managing multi-agent systems. Designed for flexibility and
            scalability, PyAgenity enables developers to create intelligent
            agents that collaborate, communicate, and solve complex tasks
            together.
          </TypingAnimation>
        </div>

        {/* Configuration Card - spans full width */}
        <div className="mb-6">
          <ConfigurationCard />
        </div>
      </div>
    </div>
  )
}

export default DashboardUI
