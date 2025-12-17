// 1. CONFIGURATION
const LQI = {
    "PL": 1.00,
    "LaLiga": 0.95,
    "Bundesliga": 0.88,
    "Ligue1": 0.85,
    "UCL": 1.10
};

const WEIGHTS = {
    goals: 12,
    assists: 9,
    keyPasses: 4,
    dribbles: 2,
    recovery: 1.5,
    discipline: 5 // applied to negative value
};

// 2. DATA
const PLAYERS = [
    {
        id: "haaland",
        name: "Erling Haaland",
        team: "Man City",
        role: "Striker",
        league: "PL",
        stats: {
            goals: 1.06,
            assists: 0.18,
            keyPasses: 0.8,
            dribbles: 0.5,
            recovery: 1.5,
            discipline: -0.1
        },
        image: "https://resources.premierleague.com/premierleague/photos/players/250x250/p223094.png"
    },
    {
        id: "lewandowski",
        name: "Robert Lewandowski",
        team: "Bayern / Barcelona",
        role: "Striker",
        league: "Bundesliga",
        stats: {
            goals: 1.15,
            assists: 0.18,
            keyPasses: 1.2,
            dribbles: 1.1,
            recovery: 2.1,
            discipline: -0.1
        },
        image: "https://img.a.transfermarkt.technology/portrait/header/38253-1701118759.jpg?lm=1"
    },
    {
        id: "kane",
        name: "Harry Kane",
        team: "Tottenham",
        role: "Striker (No. 9.5)",
        league: "PL",
        stats: {
            goals: 0.70,
            assists: 0.39,
            keyPasses: 2.1,
            dribbles: 1.4,
            recovery: 2.5,
            discipline: -0.2
        },
        image: "https://resources.premierleague.com/premierleague/photos/players/250x250/p78830.png"
    },
    {
        id: "mbappe",
        name: "Kylian Mbappé",
        team: "PSG",
        role: "Winger/Forward",
        league: "Ligue1",
        stats: {
            goals: 0.85,
            assists: 0.35,
            keyPasses: 1.9,
            dribbles: 4.5,
            recovery: 1.8,
            discipline: -0.2
        },
        image: "https://img.a.transfermarkt.technology/portrait/header/342229-1682683695.jpg?lm=1"
    },
    {
        id: "vini",
        name: "Vinícius Júnior",
        team: "Real Madrid",
        role: "Winger",
        league: "LaLiga",
        stats: {
            goals: 0.50,
            assists: 0.30,
            keyPasses: 2.0,
            dribbles: 5.4,
            recovery: 3.5,
            discipline: -0.4
        },
        image: "https://img.a.transfermarkt.technology/portrait/header/371998-1664869583.jpg?lm=1"
    },
    {
        id: "messi",
        name: "Lionel Messi",
        team: "PSG",
        role: "Playmaker",
        league: "Ligue1",
        stats: {
            goals: 0.45,
            assists: 0.55,
            keyPasses: 3.6,
            dribbles: 3.1,
            recovery: 1.8,
            discipline: -0.1
        },
        image: "https://img.a.transfermarkt.technology/portrait/header/28003-1694590254.jpg?lm=1"
    },
    {
        id: "kdb",
        name: "Kevin De Bruyne",
        team: "Man City",
        role: "Attacking Mid",
        league: "PL",
        stats: {
            goals: 0.25,
            assists: 0.60,
            keyPasses: 3.5,
            dribbles: 1.2,
            recovery: 4.1,
            discipline: -0.1
        },
        image: "https://resources.premierleague.com/premierleague/photos/players/250x250/p61366.png"
    },
    {
        id: "pedri",
        name: "Pedri",
        team: "Barcelona",
        role: "Central Mid",
        league: "LaLiga",
        stats: {
            goals: 0.10,
            assists: 0.15,
            keyPasses: 1.5,
            dribbles: 1.8,
            recovery: 6.7,
            discipline: -0.1
        },
        image: "https://img.a.transfermarkt.technology/portrait/header/683840-1620304992.jpg?lm=1"
    }
];

// 3. LOGIC
function calculateTotalScore(player) {
    const lqi = LQI[player.league];
    let rawScore = 0;

    // Positive
    rawScore += (player.stats.goals * WEIGHTS.goals);
    rawScore += (player.stats.assists * WEIGHTS.assists);
    rawScore += (player.stats.keyPasses * WEIGHTS.keyPasses);
    rawScore += (player.stats.dribbles * WEIGHTS.dribbles);
    rawScore += (player.stats.recovery * WEIGHTS.recovery);

    // Apply LQI
    let adjScore = rawScore * lqi;

    // Discipline (negative, not affected by LQI typically, but for simplicity keep separate)
    adjScore += (player.stats.discipline * WEIGHTS.discipline);

    return (adjScore * 3.5).toFixed(1); // Normalizing factor
}

// 4. GUI RENDER
const leaderboardContainer = document.getElementById('leaderboard-container');
const playerASelect = document.getElementById('playerA-select');
const playerBSelect = document.getElementById('playerB-select');
const ctx = document.getElementById('comparisonChart').getContext('2d');
let compareChart = null;

function init() {
    // Calc Scores
    PLAYERS.forEach(p => p.score = calculateTotalScore(p));
    PLAYERS.sort((a, b) => b.score - a.score);

    // Render Rows
    PLAYERS.forEach((p, index) => {
        const row = document.createElement('div');
        row.className = 'player-row';
        row.onclick = () => openModal(p);
        row.innerHTML = `
            <div class="rank">#${index + 1}</div>
            <div class="player-info">
                <img src="${p.image}" alt="${p.name}">
                <div class="player-details">
                    <h3>${p.name}</h3>
                    <span>${p.team} • ${p.role}</span>
                </div>
            </div>
            <div class="player-score">
                <span class="score-value">${p.score}</span>
                <span class="score-label">Points</span>
            </div>
        `;
        leaderboardContainer.appendChild(row);

        // Selects
        playerASelect.add(new Option(p.name, p.id));
        playerBSelect.add(new Option(p.name, p.id));
    });

    // Defaults
    if (PLAYERS.length > 1) {
        playerASelect.value = PLAYERS[0].id;
        playerBSelect.value = PLAYERS[1].id;
    }

    updateComparison();

    // Listeners
    playerASelect.addEventListener('change', updateComparison);
    playerBSelect.addEventListener('change', updateComparison);
}

// 5. MODAL LOGIC
function openModal(player) {
    const modal = document.getElementById('breakdown-modal');
    document.getElementById('modal-player-name').innerText = player.name + " - Impact Breakdown";
    const lqi = LQI[player.league];

    // Compute detailed point contributions (already normalized in the same way as total score)
    const goalPts = player.stats.goals * WEIGHTS.goals * lqi * 3.5;
    const assistPts = player.stats.assists * WEIGHTS.assists * lqi * 3.5;
    const keyPassPts = player.stats.keyPasses * WEIGHTS.keyPasses * lqi * 3.5;
    const dribblePts = player.stats.dribbles * WEIGHTS.dribbles * lqi * 3.5;
    const recoveryPts = player.stats.recovery * WEIGHTS.recovery * lqi * 3.5;
    const disciplinePts = player.stats.discipline * WEIGHTS.discipline * 3.5; // negative

    const totalScore = parseFloat(player.score);
    const share = (value) => {
        if (!totalScore || !isFinite(totalScore)) return 0;
        return ((value / totalScore) * 100).toFixed(1);
    };

    let html = `
        <div style="margin-bottom:20px; color:#666; font-size:0.9rem;">
            League: <strong>${player.league}</strong> (LQI: x${lqi})
        </div>
        <table class="breakdown-table">
        <thead>
            <tr>
                <th>Metric (Per 90)</th>
                <th>Value</th>
                <th>Weight</th>
                <th>LQI Adj.</th>
                <th>Points (+/-)</th>
            </tr>
        </thead>
        <tbody>
    `;

    // Helper row builder
    const addRow = (label, val, weight, isLqi) => {
        const subTotal = val * weight;
        const total = isLqi ? (subTotal * lqi) : subTotal; // Discipline might not use LQI
        const displayTotal = (total * 3.5).toFixed(1); // Applying the same norm factor for consistency
        return `
            <tr>
                <td>${label}</td>
                <td>${val}</td>
                <td>x ${weight}</td>
                <td>${isLqi ? 'YES (x' + lqi + ')' : 'NO'}</td>
                <td style="font-weight:600;">${displayTotal}</td>
            </tr>
        `;
    };

    html += addRow("Goals", player.stats.goals, WEIGHTS.goals, true);
    html += addRow("Assists", player.stats.assists, WEIGHTS.assists, true);
    html += addRow("Key Passes", player.stats.keyPasses, WEIGHTS.keyPasses, true);
    html += addRow("Dribbles", player.stats.dribbles, WEIGHTS.dribbles, true);
    html += addRow("Recoveries", player.stats.recovery, WEIGHTS.recovery, true);
    html += addRow("Discipline", player.stats.discipline, WEIGHTS.discipline, false); // No LQI on cards

    html += `
            <tr class="total-row">
                <td colspan="4">TOTAL ERA IMPACT SCORE</td>
                <td>${player.score}</td>
            </tr>
        </tbody>
        </table>
        <p style="margin-top:20px; font-size:0.8rem; color:#999;">
            *Normalization Factor (x3.5) applied to scale raw metric output to final 100-pt index.
        </p>
        <div class="modal-analytics">
            <h3>Analytical Notes</h3>
            <ul>
                <li>
                    <strong>Goal Threat:</strong>
                    contributes approximately <strong>${goalPts.toFixed(1)} pts</strong>
                    (${share(goalPts)}% of the final score). This captures pure scoring volume adjusted by league quality.
                </li>
                <li>
                    <strong>Creative Output (Assists + Key Passes):</strong>
                    around <strong>${(assistPts + keyPassPts).toFixed(1)} pts</strong>
                    (${share(assistPts + keyPassPts)}%). This represents how often ${player.name.split(' ')[0]}
                    turns possession into shots for teammates – a key driver for playmakers in this model.
                </li>
                <li>
                    <strong>Ball Carrying & 1v1 Threat (Dribbles):</strong>
                    adds about <strong>${dribblePts.toFixed(1)} pts</strong>
                    (${share(dribblePts)}%), rewarding players who break lines off the dribble rather than only finishing moves.
                </li>
                <li>
                    <strong>Defensive & Out-of-Possession Work (Recoveries):</strong>
                    contributes roughly <strong>${recoveryPts.toFixed(1)} pts</strong>
                    (${share(recoveryPts)}%). This is where control midfielders and hard‑working forwards gain extra value.
                </li>
                <li>
                    <strong>Discipline & Risk:</strong>
                    applies a penalty of <strong>${disciplinePts.toFixed(1)} pts</strong>
                    (${share(disciplinePts)}%). Fouls, cards and errors slightly drag the score down if they appear too often.
                </li>
            </ul>
            <p>
                In summary, <strong>${player.name}</strong> profiles as a
                <strong>${player.role}</strong> whose Era Impact Score is built from a mix of
                goal threat, creative volume, and off‑ball work rather than raw goals alone.
                The LQI factor (x${lqi}) boosts or slightly discounts these contributions based on league strength.
            </p>
        </div>
    `;

    document.getElementById('modal-content').innerHTML = html;
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('breakdown-modal').classList.remove('active');
}

// Close on outside click
window.onclick = function (event) {
    const modal = document.getElementById('breakdown-modal');
    if (event.target === modal) {
        closeModal();
    }
};

// 6. CHART + COMPARISON SUMMARY
function updateComparison() {
    const p1 = PLAYERS.find(p => p.id === playerASelect.value);
    const p2 = PLAYERS.find(p => p.id === playerBSelect.value);
    if (!p1 || !p2) return;

    // Simple Card Render
    const renderSimpleCard = (elId, p) => {
        document.getElementById(elId).innerHTML = `
            <div style="text-align:center;">
                <img src="${p.image}" style="width:80px; height:80px; border-radius:50%; margin-bottom:10px;">
                <h4>${p.name}</h4>
                <div style="font-size:1.5rem; font-weight:800; color:var(--accent);">${p.score}</div>
                <div style="font-size:0.8rem; color:var(--text-secondary);">${p.team} • ${p.role}</div>
            </div>
        `;
    };

    renderSimpleCard('card-playerA', p1);
    renderSimpleCard('card-playerB', p2);

    // Chart
    if (compareChart) compareChart.destroy();

    // Normalize 0-100 logic
    const norm = (v, m) => Math.min((v / m) * 100, 100);

    const p1Vector = [
        norm(p1.stats.goals, 1.2),
        norm(p1.stats.assists, 0.6),
        norm(p1.stats.keyPasses, 4.0),
        norm(p1.stats.dribbles, 6.0),
        norm(p1.stats.recovery, 7.0)
    ];
    const p2Vector = [
        norm(p2.stats.goals, 1.2),
        norm(p2.stats.assists, 0.6),
        norm(p2.stats.keyPasses, 4.0),
        norm(p2.stats.dribbles, 6.0),
        norm(p2.stats.recovery, 7.0)
    ];

    compareChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Shooting', 'Creativity', 'Passing', 'Dribbling', 'Def. Work'],
            datasets: [
                {
                    label: p1.name,
                    data: p1Vector,
                    backgroundColor: 'rgba(44, 82, 130, 0.2)', // Blue
                    borderColor: '#2c5282',
                    borderWidth: 2
                },
                {
                    label: p2.name,
                    data: p2Vector,
                    backgroundColor: 'rgba(100, 100, 100, 0.2)', // Gray
                    borderColor: '#666666',
                    borderWidth: 2
                }
            ]
        },
        options: {
            scales: {
                r: {
                    angleLines: { color: '#e2e8f0' },
                    grid: { color: '#e2e8f0' },
                    pointLabels: {
                        font: { size: 11 }
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            }
        }
    });

    // Textual comparison summary
    const summaryEl = document.getElementById('comparison-summary');
    const diff = {
        shooting: (p1Vector[0] - p2Vector[0]).toFixed(0),
        creativity: (p1Vector[1] + p1Vector[2] - (p2Vector[1] + p2Vector[2])).toFixed(0), // assists + key passes proxy
        dribbling: (p1Vector[3] - p2Vector[3]).toFixed(0),
        defense: (p1Vector[4] - p2Vector[4]).toFixed(0)
    };

    const leader = parseFloat(p1.score) >= parseFloat(p2.score) ? p1 : p2;
    const trailer = leader.id === p1.id ? p2 : p1;

    // Build narrative like:
    // "De Bruyne scores higher in Creativity (+40 pts) which offsets Haaland's Shooting (+30 pts) advantage."
    const creativityEdge = leader.id === p1.id ? diff.creativity : (-diff.creativity).toFixed(0);
    const shootingEdge = leader.id === p1.id ? diff.shooting : (-diff.shooting).toFixed(0);

    let narrative = `${leader.name} leads the model overall (${leader.score} vs ${trailer.score}). `;

    if (creativityEdge > 0) {
        narrative += `${leader.name} scores higher in creativity (assists + key passes) by approximately +${creativityEdge} points, `;
    } else if (creativityEdge < 0) {
        narrative += `${trailer.name} actually edges creativity by roughly +${Math.abs(creativityEdge)} points, `;
    }

    if (shootingEdge > 0) {
        narrative += `while also holding a shooting advantage of about +${shootingEdge} points. `;
    } else if (shootingEdge < 0) {
        narrative += `but ${trailer.name} compensates with a shooting edge of roughly +${Math.abs(shootingEdge)} points. `;
    }

    narrative += `Defensive work and dribbling differences are smaller margins and act as tie‑breakers rather than primary drivers.`;

    summaryEl.textContent = narrative;
}

// Start
init();


