/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
        swcPlugins: [["next-superjson-plugin", {}]]
    },
    images: {
        loader: "default",
        remotePatterns: [
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
                port: "",
                pathname: "/u/**"
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                port: ""
            }
        ]
    }
};

module.exports = nextConfig;
