import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LivestreamPlayer from './LivestreamPlayer';

function LivestreamOverlays() {
  const [overlays, setOverlays] = useState([]);
  const [overlayInput, setOverlayInput] = useState({ text: '', x: '', y: '' });
  const [updatedOverlayInput, setUpdatedOverlayInput] = useState({ text: '', x: '', y: '' });
  const [hoveredOverlay, setHoveredOverlay] = useState(null); 
  const [isEditing, setIsEditing] = useState(false); 
  const [overlayIdToEdit, setOverlayIdToEdit] = useState(null); 

  useEffect(() => {
    fetchOverlays();
  }, []);

  const fetchOverlays = async () => {
    const response = await axios.get('http://127.0.0.1:5001/overlays');
    setOverlays(response.data);
  };

  const createOverlay = async () => {
    await axios.post('http://127.0.0.1:5001/overlays', overlayInput);
    fetchOverlays();
    setOverlayInput({ text: '', x: '', y: '' });
  };

  const openUpdateModal = (overlay) => {
    setUpdatedOverlayInput({ text: overlay.content, x: overlay.x, y: overlay.y });
    setOverlayIdToEdit(overlay.id);
    setIsEditing(true); 
  };

  const updateOverlay = async () => {
    if (!overlayIdToEdit) return; 
    await axios.put(`http://127.0.0.1:5001/overlays/${overlayIdToEdit}`, updatedOverlayInput);
    fetchOverlays();
    setIsEditing(false); 
    setUpdatedOverlayInput({ text: '', x: '', y: '' });
  };

  const deleteOverlay = async (id) => {
    await axios.delete(`http://127.0.0.1:5001/overlays/${id}`);
    fetchOverlays();
  };

  return (
    <>
      <div className="flex flex-col items-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 min-h-screen p-8">
        <h1 className="text-6xl font-bold mb-8 my-8 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-500">
          Livestream Manager
        </h1>

        <div className="flex flex-col md:flex-row mb-4 space-y-4 md:space-y-0 md:space-x-4">
          <input
            type="text"
            placeholder="Overlay Text"
            value={overlayInput.text}
            onChange={(e) => setOverlayInput({ ...overlayInput, text: e.target.value })}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-4 focus:ring-pink-500 shadow-lg"
          />
          <input
            type="number"
            placeholder="X-axis"
            value={overlayInput.x}
            onChange={(e) => setOverlayInput({ ...overlayInput, x: Number(e.target.value) })}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-4 focus:ring-pink-500 shadow-lg"
          />
          <input
            type="number"
            placeholder="Y-axis"
            value={overlayInput.y}
            onChange={(e) => setOverlayInput({ ...overlayInput, y: Number(e.target.value) })}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-4 focus:ring-pink-500 shadow-lg"
          />
          <button
            onClick={createOverlay}
            className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white rounded-lg px-4 py-2 hover:scale-105 transition duration-300 shadow-lg"
          >
            Add Overlay
          </button>
        </div>

        {/* Overlay Container */}
        <div className="relative w-full max-w-4xl h-[500px] border-4 border-transparent bg-white bg-opacity-30 rounded-lg overflow-hidden shadow-lg">
          <LivestreamPlayer />

          {overlays.map((overlay) => (
            <div
              key={overlay.id}
              style={{
                position: 'absolute',
                left: overlay.x,
                top: overlay.y,
                background: 'rgba(0, 0, 0, 0.6)',
                padding: '8px',
                color: 'white',
                borderRadius: '8px',
                zIndex: 100,
              }}
              className="transition-transform transform hover:scale-105 relative shadow-md"
              onMouseOver={() => setHoveredOverlay(overlay.id)}
              onMouseOut={() => setHoveredOverlay(null)}
              onClick={() => openUpdateModal(overlay)} 
            >
              {overlay.content}

              {hoveredOverlay === overlay.id && (
                <>
                  <button
                    onClick={() => deleteOverlay(overlay.id)}
                    className="absolute top-[-10px] right-[-10px] text-red-500 hover:text-red-700 focus:outline-none bg-white rounded-full p-1"
                  >
                    &#10006;
                  </button>

                  <div className="absolute top-[-54px]  transform -translate-x-1/2 bg-gray-800 text-white text-sm p-1 rounded-md w-[200px]">
                    Click on overlay to update
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Editing Overlay */}
      {isEditing && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-[90%] max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-500">
              Update Overlay
            </h2>
            <input
              type="text"
              placeholder="Overlay Text"
              value={updatedOverlayInput.text}
              onChange={(e) => setUpdatedOverlayInput({ ...updatedOverlayInput, text: e.target.value })}
              className="border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-4 focus:ring-blue-500 w-full shadow-md"
            />
            <input
              type="number"
              placeholder="X-axis"
              value={updatedOverlayInput.x}
              onChange={(e) => setUpdatedOverlayInput({ ...updatedOverlayInput, x: Number(e.target.value) })}
              className="border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-4 focus:ring-blue-500 w-full shadow-md"
            />
            <input
              type="number"
              placeholder="Y-axis"
              value={updatedOverlayInput.y}
              onChange={(e) => setUpdatedOverlayInput({ ...updatedOverlayInput, y: Number(e.target.value) })}
              className="border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-4 focus:ring-blue-500 w-full shadow-md"
            />

            <div className="flex justify-between">
              <button
                onClick={updateOverlay}
                className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white rounded-lg px-4 py-2 hover:scale-105 transition duration-300 shadow-lg"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-lg px-4 py-2 hover:scale-105 transition duration-300 shadow-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LivestreamOverlays;
