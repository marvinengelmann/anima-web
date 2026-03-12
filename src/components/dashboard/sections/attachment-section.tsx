import { fetchAttachmentData } from "@/lib/data"
import { AttachmentChart } from "../attachment-chart"

export async function AttachmentSection() {
  const data = await fetchAttachmentData()

  const hasValues = Object.values(data.style).some((v) => v > 0)
  if (!hasValues) return null

  return <AttachmentChart data={data} />
}
