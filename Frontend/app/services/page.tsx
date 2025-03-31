"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"

const services = [
  {
    id: 1,
    title: "Classic Haircut",
    description: "Precision cut with attention to detail and personal style.",
    price: "$25",
    duration: "30 min",
    image:
      "https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: 2,
    title: "Beard Trim",
    description: "Expert shaping and styling for a well-groomed beard.",
    price: "$15",
    duration: "20 min",
    image:
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
  },
  {
    id: 3,
    title: "Hot Towel Shave",
    description: "Luxurious traditional hot towel shave for the smoothest finish.",
    price: "$30",
    duration: "45 min",
    image:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  },
  {
    id: 4,
    title: "Hair Styling",
    description: "Professional styling for any occasion or everyday look.",
    price: "$35",
    duration: "40 min",
    image:
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  },
  {
    id: 5,
    title: "Hair Coloring",
    description: "Expert color treatments for a fresh new look.",
    price: "$50",
    duration: "90 min",
    image:
      "https://images.unsplash.com/photo-1620331311520-246422fd82f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
  },
  {
    id: 6,
    title: "Kids Haircut",
    description: "Gentle and friendly haircuts for the little ones.",
    price: "$20",
    duration: "25 min",
    image:
      "https://images.unsplash.com/photo-1631197088408-3ba4612cd8e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
  },
]

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<number | null>(null)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="relative">
      {/* Parallax Header */}
      <div
        className="h-[50vh] relative flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1622286342621-4bd786c2447c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <motion.div className="relative z-10 text-center" style={{ opacity, y }}>
          <motion.h1
            className="text-5xl font-bold text-white mb-4 font-playfair"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Our Services
          </motion.h1>
          <motion.p
            className="text-xl text-gray-200 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Professional hair services to keep you looking your best
          </motion.p>
        </motion.div>
      </div>

      <div className="container mx-auto py-12 px-4">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={item}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedService(service.id === selectedService ? null : service.id)}
            >
              <Card
                className={`overflow-hidden h-full transition-all duration-300 cursor-pointer ${
                  selectedService === service.id
                    ? "border-gold shadow-lg shadow-gold/20"
                    : "hover:shadow-xl hover:shadow-gold/10 border-gold/10 hover:border-gold/30"
                }`}
              >
                <div className="h-48 relative bg-cover bg-center overflow-hidden">
                  <motion.div
                    className="w-full h-full"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      backgroundImage: `url(${service.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                </div>
                <CardHeader>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <p className="text-2xl font-bold text-gold">{service.price}</p>
                    <p className="text-sm text-muted-foreground">{service.duration}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/appointment" className="w-full">
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full">
                      <Button className="w-full bg-gold hover:bg-gold/80 text-black">Book Now</Button>
                    </motion.div>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

