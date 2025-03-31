"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion, useInView } from "framer-motion"
import Image from "next/image"

const products = [
  {
    id: 1,
    title: "Premium Hair Pomade",
    description: "Strong hold with a matte finish for all-day styling.",
    price: "$18.99",
    image:
      "https://images.unsplash.com/photo-1542818279-04aa19d54f06?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    title: "Beard Oil",
    description: "Nourishing oil to keep your beard soft and healthy.",
    price: "$22.99",
    image:
      "https://images.unsplash.com/photo-1627875777314-da35433c0c8e?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    title: "Styling Clay",
    description: "Medium hold with a natural finish for textured styles.",
    price: "$19.99",
    image:
      "https://mrhygiene.shop/cdn/shop/files/Hair-Clay.jpg?v=1728862259&width=1946",
  },
  {
    id: 4,
    title: "Shampoo & Conditioner Set",
    description: "Premium hair care for all hair types.",
    price: "$32.99",
    image:
      "https://images.unsplash.com/photo-1610595433626-e45abdb5a88b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 5,
    title: "Beard Brush",
    description: "High-quality brush for beard maintenance.",
    price: "$15.99",
    image:
      "https://images.unsplash.com/photo-1577467013350-7c22a844e1a9?q=80&w=1954&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 6,
    title: "Hair Spray",
    description: "Flexible hold spray for finishing your style.",
    price: "$16.99",
    image:
      "https://images.unsplash.com/photo-1597354984706-fac992d9306f?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
]

export default function ProductsPage() {
  const [scrollY, setScrollY] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      })
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

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

      <div ref={headerRef} className="h-[50vh] relative flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            x: mousePosition.x * -30,
            y: mousePosition.y * -30,
          }}
        />


        <div className="absolute inset-0 bg-black bg-opacity-70 z-10"></div>
        <div
          className="absolute inset-0 z-20 opacity-10"
          style={{
            backgroundImage:
              'url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%23d4af37" fillOpacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')',
          }}
        ></div>

 
        <div className="relative z-30 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-5xl font-bold text-white mb-4 font-playfair"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
            >
              Premium Products
            </motion.h1>
            <motion.div
              className="h-1 w-20 bg-gold mx-auto mb-6"
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            ></motion.div>
            <motion.p
              className="text-xl text-gray-200 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              Elevate your grooming routine with our selection of high-quality products
            </motion.p>
          </motion.div>
        </div>

        {/* Animated Gradient Overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-dark to-transparent z-30"
          style={{
            transform: `translateY(${Math.min(scrollY * 0.5, 0)}px)`,
          }}
        ></div>
      </div>

      <div className="container mx-auto py-12 px-4">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={item} whileHover={{ y: -8 }} className="h-full">
              <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-xl hover:shadow-gold/20 border-gold/10 hover:border-gold/30 bg-dark-card">
                <div className="h-64 relative overflow-hidden">
                  <motion.div
                    className="w-full h-full relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      fill
                      style={{ objectFit: "cover" }}
                      className="transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.div>
                  <div className="absolute top-3 right-3 bg-gold text-black px-3 py-1 rounded-full text-sm font-bold">
                    {product.price}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl text-white">{product.title}</CardTitle>
                  <CardDescription className="text-gray-400">{product.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <motion.div className="w-full" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button className="w-full bg-gold hover:bg-gold/80 text-black">Add to Cart</Button>
                  </motion.div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

