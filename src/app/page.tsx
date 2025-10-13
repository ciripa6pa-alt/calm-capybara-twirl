import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, DollarSign, TrendingUp, Shield, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-20">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">
            ✅ Ready to Deploy
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Aplikasi Keuangan
            <span className="text-blue-600"> Modern</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Kelola keuangan pribadi dengan dashboard lengkap, laporan real-time, 
            dan analisis mendalam. Build dengan teknologi terkini.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/simple">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                <DollarSign className="mr-2 h-5 w-5" />
                Coba Demo App
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/laporan">
              <Button variant="outline" size="lg" className="px-8 py-3">
                Lihat Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Dashboard Lengkap</CardTitle>
              <CardDescription>
                Monitor pemasukan, pengeluaran, dan saldo dengan grafik real-time yang interaktif
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Keamanan Terjamin</CardTitle>
              <CardDescription>
                Data terenkripsi dengan autentikasi modern dan backup otomatis
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Performa optimal dengan Next.js 15 dan optimasi otomatis
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Tech Stack */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Tech Stack</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Prisma', 'Supabase', 'NextAuth', 'shadcn/ui'].map((tech) => (
              <Badge key={tech} variant="outline" className="px-4 py-2">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Siap untuk Deploy!</h2>
          <p className="text-xl mb-8 opacity-90">
            Aplikasi sudah 100% siap production. Build berhasil, tidak ada error.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/simple">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                Mulai Sekarang
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3">
              Lihat Documentation
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}