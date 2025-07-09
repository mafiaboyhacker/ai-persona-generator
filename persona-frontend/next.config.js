/** @type {import('next').NextConfig} */
const nextConfig = {
  // ESLint 오류 무시 (배포 시)
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // TypeScript 오류 무시 (배포 시)
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // 이미지 최적화 설정
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // 정적 파일 압축
  compress: true,
  
  // 실험적 기능 비활성화 (배포 안정성)
  experimental: {
    // optimizeCss: true, // 임시 비활성화
  },
  
  // 보안 헤더
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // 비디오 파일 캐싱
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/videos/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig