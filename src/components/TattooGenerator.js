'use client';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import './TattooGenerator.css';

export default function TattooGenerator() {
    const [prompt, setPrompt] = useState("");
    const [count, setCount] = useState(1);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [typedText, setTypedText] = useState("");
    const [typedText2, setTypedText2] = useState("");
    const [showEducation, setShowEducation] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const fullText1 = "Unlock Creativity with";
    const fullText2 = "AI-Powered Tattoo Generator";

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setTypedText(fullText1.slice(0, i + 1));
            i++;
            if (i === fullText1.length) clearInterval(interval);
        }, 100); // slowed down
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            let i = 0;
            const interval2 = setInterval(() => {
                setTypedText2(fullText2.slice(0, i + 1));
                i++;
                if (i === fullText2.length) clearInterval(interval2);
            }, 100); // slowed down
            return () => clearInterval(interval2);
        }, 2200); // delay for second line
        return () => clearTimeout(timeout);
    }, []);

    const handleSuggestionClick = (text) => {
        setPrompt(text);
    };

    const generateTattoo = async () => {
        if (!prompt.trim()) return alert("Please enter a prompt!");
        setLoading(true);
        setImages([]);

        try {
            const requests = Array.from({ length: count }).map(() =>
                fetch("/api/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ prompt }),
                }).then(res => {
                    if (!res.ok) throw new Error("Failed to generate");
                    return res.blob();
                })
            );

            const blobs = await Promise.all(requests);
            const urls = blobs.map(blob => URL.createObjectURL(blob));
            setImages(urls);
        } catch (err) {
            alert("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const downloadImage = (url, index) => {
        const a = document.createElement('a');
        a.href = url;
        a.download = `tattoo_${index + 1}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const getStyledText = (text) => {
        return text.split(" ").map((word, i) => {
            if (word.toLowerCase().includes("creativity") || word.toLowerCase().includes("ai-powered")) {
                return <span key={i} className="highlight">{word} </span>;
            }
            return <span key={i}>{word} </span>;
        });
    };

    const toggleEducation = () => {
        setShowEducation(!showEducation);
    };

    const openPreview = (imageUrl) => {
        setPreviewImage(imageUrl);
        setPreviewMode(true);
    };

    const closePreview = () => {
        setPreviewMode(false);
    };

    return (
        <div className="tattoo-container">
            <h1 className="typewriter-heading">
                <span>{getStyledText(typedText)}</span>
                <br />
                <span>{getStyledText(typedText2)}</span>
            </h1>

            <div className="input-group">
                <input
                    type="text"
                    placeholder="Describe your tattoo idea..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <input
                    type="number"
                    min="1"
                    max="3"
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    placeholder="Count"
                />
                <button onClick={generateTattoo} disabled={loading}>
                    {loading ? "Generating..." : `Generate ${count} Tattoo${count > 1 ? "s" : ""}`}
                </button>
            </div>

            <div className="suggestions">
                <p>Try these:</p>
                {["Minimalist lotus flower", "Geometric wolf head", "Skull with roses", "Cosmic galaxy sleeve", "Dragon wrapped around sword"].map((sug, idx) => (
                    <button key={idx} onClick={() => handleSuggestionClick(sug)}>
                        {sug}
                    </button>
                ))}
            </div>

            {loading && <p className="loading-text">Please wait while your tattoos are being generated...</p>}

            <div className="image-grid">
                {images.map((img, i) => (
                    <div key={i} className="image-card">
                        <Image 
                            src={img} 
                            alt={`Tattoo ${i + 1}`} 
                            width={300} 
                            height={300} 
                            layout="responsive"
                        />
                        <div className="image-actions">
                            <button onClick={() => downloadImage(img, i)}>Download</button>
                            <button className="preview-btn" onClick={() => openPreview(img)}>Preview</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Preview Modal */}
            {previewMode && (
                <div className="preview-modal-overlay" onClick={closePreview}>
                    <div className="preview-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="preview-image-container">
                            <Image 
                                src={previewImage} 
                                alt="Tattoo Preview" 
                                width={600} 
                                height={600} 
                                layout="responsive"
                            />
                        </div>
                        <div className="preview-controls">
                            <button className="close-preview" onClick={closePreview}>Close Preview</button>
                        </div>
                    </div>
                </div>
            )}

            <motion.h1
                className="sample-heading"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5, duration: 0.6 }}
            >
                Sample <span className="highlight">Designs</span>
            </motion.h1>

            <div className="marquee-container">
                <div className="marquee-track">
                    {["/samples/sample1.webp", "/samples/sample2.webp", "/samples/sample3.webp", "/samples/sample4.webp", "/samples/sample5.webp", "/samples/sample6.jpg", "/samples/sample1.webp", "/samples/sample2.webp", "/samples/sample3.webp", "/samples/sample4.webp", "/samples/sample5.webp", "/samples/sample6.jpg"].map((img, i) => (
                        <div key={i} className="image-card">
                            <Image 
                                src={img} 
                                alt={`Sample ${i + 1}`} 
                                width={300} 
                                height={300} 
                                layout="responsive"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Educational Content Section */}
            <motion.div
                className="education-section"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.8, duration: 0.6 }}
            >
                <h2>Tattoo <span className="highlight">Education</span> Hub</h2>
                
                <button className="toggle-education" onClick={toggleEducation}>
                    {showEducation ? "Hide Information" : "Learn More About Tattoos"}
                </button>
                
                {showEducation && (
                    <div className="education-content">
                        <div className="education-card">
                            <h3>Before Getting a Tattoo</h3>
                            <ul>
                                <li>Research your artist thoroughly</li>
                                <li>Consider placement carefully</li>
                                <li>Understand how aging affects design</li>
                                <li>Stay hydrated and well-rested before your appointment</li>
                                <li>Avoid alcohol for 24 hours before your session</li>
                            </ul>
                        </div>
                        
                        <div className="education-card">
                            <h3>Aftercare Essentials</h3>
                            <ul>
                                <li>Keep the bandage on for 2-4 hours</li>
                                <li>Wash gently with antibacterial soap</li>
                                <li>Apply recommended aftercare products</li>
                                <li>Avoid swimming, direct sunlight, and heavy workouts for 2 weeks</li>
                                <li>Don&apos;t pick at scabs as they form and heal</li>
                            </ul>
                        </div>
                        
                        <div className="education-card">
                            <h3>What to Expect During Sessions</h3>
                            <ul>
                                <li>Sessions can last 1-8 hours depending on size and detail</li>
                                <li>Pain levels vary by placement and individual</li>
                                <li>Breaks are normal and encouraged</li>
                                <li>Tipping your artist (15-20%) is customary</li>
                                <li>Larger pieces may require multiple sessions</li>
                            </ul>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}