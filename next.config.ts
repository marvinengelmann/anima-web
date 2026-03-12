import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"
import { withPlausibleProxy } from "next-plausible"

const nextConfig: NextConfig = {}

const withNextIntl = createNextIntlPlugin()
export default withPlausibleProxy()(withNextIntl(nextConfig))
