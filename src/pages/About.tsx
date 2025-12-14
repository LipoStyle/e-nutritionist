import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Award, 
  Users, 
  Calendar, 
  CheckCircle, 
  Star,
  BookOpen,
  Target,
  Heart,
  Zap
} from 'lucide-react';

const About = () => {
  const certifications = [
    {
      title: "Certified Sports Nutritionist (CISSN)",
      organization: "International Society of Sports Nutrition",
      year: "2018",
      description: "Advanced certification in sports nutrition and performance optimization"
    },
    {
      title: "Registered Dietitian Nutritionist (RDN)",
      organization: "Commission on Dietetic Registration",
      year: "2016",
      description: "National credential for nutrition and dietetics professionals"
    },
    {
      title: "Master of Science in Sports Nutrition",
      organization: "University of Health Sciences",
      year: "2015",
      description: "Advanced degree focusing on athletic performance and nutrition science"
    },
    {
      title: "Certified Strength and Conditioning Specialist (CSCS)",
      organization: "National Strength and Conditioning Association",
      year: "2017",
      description: "Certification in exercise science and athletic conditioning"
    }
  ];

  const achievements = [
    { number: "500+", label: "Athletes Coached", icon: Users },
    { number: "10+", label: "Years Experience", icon: Calendar },
    { number: "95%", label: "Client Success Rate", icon: Target },
    { number: "50+", label: "Published Articles", icon: BookOpen }
  ];

  const specializations = [
    {
      title: "Athletic Performance Nutrition",
      description: "Optimizing nutrition for competitive athletes across all sports disciplines",
      icon: Zap
    },
    {
      title: "Weight Management",
      description: "Evidence-based approaches to healthy weight loss and muscle gain",
      icon: Target
    },
    {
      title: "Sports Recovery",
      description: "Nutrition strategies for faster recovery and injury prevention",
      icon: Heart
    },
    {
      title: "Meal Planning & Prep",
      description: "Practical meal planning solutions for busy athletes and professionals",
      icon: Calendar
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 gradient-hero text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                Meet Your Certified 
                <span className="block text-secondary">Sports Nutritionist</span>
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                I'm Sarah Johnson, a passionate nutrition professional dedicated to helping athletes 
                and active individuals achieve their peak performance through evidence-based nutrition strategies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 transition-colors"
                  asChild
                >
                  <Link to="/contact">
                    Book Consultation
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-primary transition-colors"
                  asChild
                >
                  <Link to="/services">
                    View Services
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/images/about-nutritionist_20251211_133645.png" 
                alt="Sarah Johnson - Sports Nutritionist" 
                className="rounded-2xl shadow-strong w-full h-auto"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-medium">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="font-semibold text-foreground">10+ Years</span>
                </div>
                <p className="text-sm text-muted-foreground">Professional Experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-accent-light/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Professional Achievements</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A track record of success in helping clients achieve their health and performance goals
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <div key={index} className="text-center space-y-3">
                  <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-primary">
                    {achievement.number}
                  </div>
                  <div className="text-muted-foreground font-medium">
                    {achievement.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* My Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">My Story</h2>
              <p className="text-xl text-muted-foreground">
                From competitive athlete to certified nutritionist
              </p>
            </div>
            
            <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed space-y-6">
              <p>
                My journey into sports nutrition began as a competitive swimmer in college. I experienced firsthand 
                how proper nutrition could dramatically impact performance, recovery, and overall well-being. This 
                personal experience sparked a passion that would eventually become my life's work.
              </p>
              
              <p>
                After completing my Master's degree in Sports Nutrition, I began working with local athletic teams 
                and individual athletes. What started as helping a few swimmers optimize their nutrition quickly 
                grew into a comprehensive practice serving athletes across all disciplines – from weekend warriors 
                to Olympic competitors.
              </p>
              
              <p>
                Over the past decade, I've had the privilege of working with over 500 athletes, helping them achieve 
                personal bests, recover from injuries faster, and maintain peak performance throughout their careers. 
                My approach combines cutting-edge nutritional science with practical, real-world application that 
                fits into busy athletic schedules.
              </p>
              
              <p>
                Today, I continue to stay at the forefront of sports nutrition research, regularly attending 
                conferences, contributing to peer-reviewed publications, and most importantly, applying the latest 
                evidence-based strategies to help my clients succeed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Specializations Section */}
      <section className="py-20 bg-accent-light/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Areas of Expertise</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Specialized knowledge and experience across key areas of sports nutrition
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {specializations.map((spec, index) => {
              const IconComponent = spec.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-medium transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{spec.title}</h3>
                        <p className="text-muted-foreground">{spec.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Education & Certifications</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Continuous learning and professional development to provide the best care
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {certifications.map((cert, index) => (
              <Card key={index} className="p-6 hover:shadow-medium transition-shadow">
                <CardContent className="p-0">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold">{cert.title}</h3>
                        <Badge variant="outline">{cert.year}</Badge>
                      </div>
                      <p className="text-primary font-medium mb-2">{cert.organization}</p>
                      <p className="text-sm text-muted-foreground">{cert.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-accent-light/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-8">My Philosophy</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="space-y-4">
                <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Evidence-Based</h3>
                <p className="text-muted-foreground">
                  Every recommendation is backed by the latest scientific research and proven methodologies.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Individualized</h3>
                <p className="text-muted-foreground">
                  No two athletes are the same. Every plan is tailored to your unique needs and goals.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Results-Focused</h3>
                <p className="text-muted-foreground">
                  Practical strategies that deliver measurable improvements in performance and health.
                </p>
              </div>
            </div>
            
            <blockquote className="text-2xl font-medium text-foreground italic mb-8">
              "Nutrition is not about perfection – it's about progress, consistency, and finding 
              sustainable strategies that enhance your performance and quality of life."
            </blockquote>
            
            <p className="text-lg text-muted-foreground">
              — Sarah Johnson, MS, RDN, CISSN
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Ready to Optimize Your Nutrition?
            </h2>
            <p className="text-xl text-white/90">
              Let's work together to create a personalized nutrition strategy that helps you 
              achieve your health and performance goals. Book your consultation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 transition-colors"
                asChild
              >
                <Link to="/contact">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Free Consultation
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-primary transition-colors"
                asChild
              >
                <Link to="/services">
                  View My Services
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;