import { useState } from 'react';
import React from "react";
import BeatLoader from 'react-spinners/BeatLoader';
import { Line } from 'react-chartjs-2';
import "chart.js/auto"; 

const backendUrl = '/api';

function Focus({ isDisabled, setDisplayedImage }) {
  const [steps, setSteps] = useState(20);
  const [stepSize, setStepSize] = useState(10);
  const [exposure, setExposure] = useState(1.0);
  
  const [isRunning, setIsRunning] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [resultMsg, setResultMsg] = useState('');

  const [chartData, setChartData] = useState({ labels: [], data: [] });

  const handleRunAutofocus = async () => {
    setIsRunning(true);
    setResultMsg('');
    setChartData({ labels: [], data: [] }); // Clear the chart for a new run
    
    let collectedPositions = [];
    let collectedHFDs = [];

    // step loop
    for (let i = 0; i < steps; i++) {
        setProgressMsg(`Taking exposure ${i + 1} of ${steps}...`);
        
        try {
            const stepRes = await fetch(`${backendUrl}/autofocus/step`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    exposure: exposure,
                    step_size: stepSize,
                    is_last_step: (i === steps - 1)
                })
            });

            if (!stepRes.ok) throw new Error('Network response was not ok');
            const data = await stepRes.json();

            if (data.status !== 'success') {
                throw new Error(data.message || 'Camera error');
            }

            // Record data
            const currentPos = i * stepSize;
            collectedPositions.push(currentPos);
            collectedHFDs.push(data.hfd);

            // Update the live chart state
            setChartData({
                labels: [...collectedPositions],
                data: [...collectedHFDs]
            });

            // Update the JS9 Viewer
            setDisplayedImage((old) => {
                if (old === data.image_url && window.JS9) {
                    window.JS9.RefreshImage(data.image_url);
                }
                return data.image_url;
            });

        } catch (error) {
            setIsRunning(false);
            setProgressMsg('');
            setResultMsg(`Sequence failed at step ${i + 1}: ${error.message}`);
            return; 
        }
    }

    // fit v curve
    setProgressMsg(`Analyzing V-Curve data...`);
    
    try {
        const analyzeRes = await fetch(`${backendUrl}/autofocus/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                positions: collectedPositions,
                hfds: collectedHFDs,
                step_size: stepSize,
                total_steps: steps
            })
        });

        const finalData = await analyzeRes.json();
        
        setIsRunning(false);
        setProgressMsg('');

        if (finalData.status === 'success') {
            setResultMsg(`Success! Best focus found at position: ${finalData.best_position}`);
        } else {
            setResultMsg(`Analysis Failed: ${finalData.message}`);
        }
    } catch (error) {
        setIsRunning(false);
        setProgressMsg('');
        setResultMsg(`Analysis failed: ${error.message}`);
    }
  };

  // chart config
  const plotData = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Measured HFD",
        data: chartData.data,
        borderColor: "#d17d00", 
        backgroundColor: "#00c3d1",
        tension: 0.3, 
        pointRadius: 4,
      },
    ],
  };

  const plotOptions = {
    responsive: true,                  
    maintainAspectRatio: false,        
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        title: { display: true, text: 'Relative Focuser Step (Moving In)', color: '#bdbdbc' },
        ticks: { color: '#bdbdbc' },
        grid: { color: '#444' }
      },
      y: {
        title: { display: true, text: 'Half-Flux Diameter (Pixels)', color: '#bdbdbc' },
        ticks: { color: '#bdbdbc' },
        grid: { color: '#444' }
      }
    }
  };

  return (
    <fieldset className="focus" disabled={isDisabled || isRunning}>
      <legend>Automated V-Curve Autofocus</legend>
      
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
        <label>
          Total Steps:
          <input 
            type="number" 
            value={steps} 
            onChange={(e) => setSteps(Number(e.target.value))} 
            style={{ width: "60px", marginLeft: "10px" }}
          />
        </label>
        
        <label>
          Step Size:
          <input 
            type="number" 
            value={stepSize} 
            onChange={(e) => setStepSize(Number(e.target.value))} 
            style={{ width: "60px", marginLeft: "10px" }}
          />
        </label>

        <label>
          Exposure (s):
          <input 
            type="number" 
            value={exposure} 
            onChange={(e) => setExposure(Number(e.target.value))} 
            step="0.1"
            style={{ width: "60px", marginLeft: "10px" }}
          />
        </label>

        {isRunning ? (
            <div style={{ marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
                <BeatLoader color="#0ed100" size={10} />
                <span style={{ marginLeft: '10px', color: '#0ed100' }}>{progressMsg}</span>
            </div>
        ) : (
            <button className="temp-set" onClick={handleRunAutofocus}>
                Run Autofocus
            </button>
        )}
      </div>

      {resultMsg && (
        <div style={{ marginTop: '15px', color: resultMsg.includes('Success') ? '#5bcc09' : 'red' }}>
            {resultMsg}
        </div>
      )}

      {/* live chart */}
      {chartData.labels.length > 0 && (
        <div style={{ marginTop: '25px', padding: '15px', backgroundColor: '#1e1e1e', borderRadius: '8px', border: '1px solid #333' }}>
            <h4 style={{ textAlign: 'center', margin: '0 0 15px 0', color: '#bdbdbc', fontSize: '16px' }}>V-Curve Data</h4>
            
            {/* The new wrapper div that forces the chart to behave */}
            <div style={{ position: 'relative', height: '300px', width: '100%' }}>
                <Line data={plotData} options={plotOptions} />
            </div>
            
        </div>
      )}
    </fieldset>
  );
}

export default Focus;