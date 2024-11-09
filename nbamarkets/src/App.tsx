import React, { useState } from 'react'
import styles from './App.module.css'

interface PPGResponse {
    player: string
    num_seasons: number
    avg_ppg: number
}

const App: React.FC = () => {
    const [playerName, setPlayerName] = useState<string>('')
    const [numSeasons, setNumSeasons] = useState<number>(2)
    const [ppgData, setPpgData] = useState<PPGResponse | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleFetchPPG = async () => {
        try {
            const response = await fetch(`/api/ppg/${encodeURIComponent(playerName)}/${numSeasons}`)
            if (!response.ok) {
                throw new Error("Player not found")
            }
            const data: PPGResponse = await response.json()
            setPpgData(data)
            setError(null)
        } catch (err) {
            setError((err as Error).message)
            setPpgData(null)
        }
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>NBA Player PPG Lookup</h1>
            <div className={styles.inputGroup}>
                <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter player name"
                    className={styles.input}
                />
                <input
                    type="number"
                    value={numSeasons}
                    onChange={(e) => setNumSeasons(parseInt(e.target.value))}
                    placeholder="Number of seasons"
                    className={styles.input}
                />
            </div>
            <button onClick={handleFetchPPG} className={styles.button}>Get Average PPG</button>
            {ppgData && (
                <div className={styles.result}>
                    <h2>{ppgData.player}</h2>
                    <p>Average PPG over last {ppgData.num_seasons} seasons: <strong>{ppgData.avg_ppg}</strong></p>
                </div>
            )}
            {error && <p className={styles.error}>{error}</p>}
        </div>
    )
}

export default App
