export const buildSSEResponse = (data) => {
  return `data: ${JSON.stringify(data)}\n\n`
}

export const sseHeaders = {
  'Content-Type': 'text/event-stream',
  Connection: 'keep-alive',
  'Cache-Control': 'no-cache'
}
