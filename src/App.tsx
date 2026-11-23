import { Scene } from './components/Scene'
import { Toolbar } from './components/Toolbar'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <Toolbar />
      <main className="viewport">
        <Scene />
        <div className="hud">
          <span>1 enhet = 1 m</span>
          <span>Høyreklikk / midt = pan (orbit)</span>
        </div>
      </main>
    </div>
  )
}
