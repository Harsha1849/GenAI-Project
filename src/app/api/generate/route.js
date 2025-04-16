// FILE: app/api/generate/route.js
export async function POST(req) {
    try {
        const { prompt } = await req.json();
        
        // Using a smaller model that generates faster
        const response = await fetch("https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.HF_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                inputs: prompt,
                options: {
                    use_cache: true,     // Use cached results when available
                    wait_for_model: true // Still wait for model but using a faster model
                }
            }),
            // Set a longer timeout for the fetch request
            signal: AbortSignal.timeout(25000) // 25 second timeout
        });

        const contentType = response.headers.get("content-type");

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Hugging Face Error Response:", errorText);
            throw new Error(`HF API failed: ${errorText}`);
        }

        if (contentType && contentType.includes("image")) {
            const imageData = await response.blob();
            return new Response(imageData, {
                status: 200,
                headers: { "Content-Type": "image/png" }
            });
        } else {
            const errorText = await response.text();
            console.error("Unexpected response:", errorText);
            throw new Error("Unexpected response from Hugging Face");
        }
    } catch (error) {
        console.error("Route POST error:", error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}