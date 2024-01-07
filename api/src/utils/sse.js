export const writeSseResponse = (res, { event, data }) => {
  res.write(`event: ${event}\n`)
  res.write(`data: ${JSON.stringify(data)}\n\n`)
}

export const sseHeaders = {
  'Content-Type': 'text/event-stream',
  Connection: 'keep-alive',
  'Cache-Control': 'no-cache'
}

export const isSseEndpoint = (res) => {
  return res.get('Content-Type') === 'text/event-stream'
}
