import { fetchAttachmentData } from "@/lib/data"
import { AttachmentChart } from "../attachment-chart"

export async function AttachmentSection() {
  const data = await fetchAttachmentData()

  return <AttachmentChart data={data} />
}
