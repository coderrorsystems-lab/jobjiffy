import './LiquidButton.css'

export default function LiquidButton({ text = 'Click Me' }) {
  return (
    <button className="liquid-button">
      {text}
    </button>
  )
}
