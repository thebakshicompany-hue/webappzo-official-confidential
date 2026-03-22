# SURAJ by WebAppzo - Web Agent

A beautifully designed, premium web agent powered by Sarvam AI (`sarvam-m`), explicitly architected for instantaneous, serverless deployment on **Netlify**.

## 🚀 How to Deploy Online (in 2 Minutes!)

Since this uses Netlify Serverless Functions, you can deploy the entire site without writing a single command by using **Netlify Drop**.

1. **Get the Folder Ready**
   Ensure you have this entire folder (`Sarvam-Agent`) containing `index.html`, `netlify.toml`, `package.json`, the `css/` and `js/` folders, and the `netlify/functions` folder.

2. **Drag & Drop Deployment**
   - Go to [Netlify Drop](https://app.netlify.com/drop).
   - Drag this entire `Sarvam-Agent` folder onto the dropping area.
   - Netlify will instantly upload and build your site.

3. **Set your API Key (CRITICAL)**
   - Once uploaded, click on **Site settings** in your Netlify dashboard.
   - Go to **Environment variables** (under Site configuration).
   - Add a new variable:
     - **Key**: `SARVAM_API_KEY`
     - **Value**: *(Paste your literal Sarvam API key here)*
     - <br>✅ **IMPORTANT**: Ensure you check the "**Contains secret values**" box before saving!
   
4. **Trigger a Redeploy**
   - After adding the API key, go to the **Deploys** tab and click **Trigger deploy** -> **Deploy site**.
   - Your AI agent is now live and securely talking to the Sarvam API!

---

## 💻 Running Locally

To run this locally, you should use the official Netlify CLI to properly simulate the serverless functions.

1. **Install Netlify CLI** (Requires Node.js installed on your computer)
   ```bash
   npm install netlify-cli -g
   ```

2. **Install Local Dependencies**
   ```bash
   npm install
   ```

3. **Run the local dev environment**
   ```bash
   netlify dev
   ```
   *Note: Make sure to either setup environment variables with Netlify CLI or manually pass `SARVAM_API_KEY=your_key netlify dev`.*
