import os
import json
import requests
from typing import List, Dict

class SarvamAgent:
    """
    A General Agent that connects to Sarvam AI using the provided API key.
    """
    def __init__(self, api_key: str, model: str = "sarvam-m"):
        self.api_key = api_key
        self.model = model
        
        # Standard OpenAI-compatible completions endpoint format often used,
        # or you can switch to a specific Sarvam endpoint if needed.
        self.base_url = "https://api.sarvam.ai/v1/chat/completions"
        self.conversation_history = [
            {"role": "system", "content": "You are SURAJ, a highly intelligent and helpful general-purpose assistant created by WebAppzo."}
        ]
        
    def chat(self, user_input: str) -> str:
        self.conversation_history.append({"role": "user", "content": user_input})
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "messages": self.conversation_history,
            "temperature": 0.5,
            "max_tokens": 1024
        }
        
        try:
            # We try the standard chat completion format
            response = requests.post(self.base_url, headers=headers, json=payload)
            response.raise_for_status()
            
            data = response.json()
            
            # OpenAI-like response parsing implementation
            if "choices" in data and len(data["choices"]) > 0:
                assistant_message = data["choices"][0]["message"]["content"]
                self.conversation_history.append({"role": "assistant", "content": assistant_message})
                return assistant_message
            else:
                return f"Unexpected response format from Sarvam API: {json.dumps(data, indent=2)}"
                
        except requests.exceptions.RequestException as e:
            # Fallback for API failure
            error_msg = f"API Error communicating with Sarvam AI: {e}"
            if hasattr(e, 'response') and e.response is not None:
                error_msg += f"\nResponse Body: {e.response.text}"
            return error_msg

def main():
    print("="*60)
    print("🤖 SURAJ by WebAppzo General Agent Initialization")
    print("="*60)
    
    # The API key provided by the user (now loaded from environment variable for security)
    api_key = os.environ.get("SARVAM_API_KEY", "")
    
    if not api_key:
        print("Error: API key is not set.")
        return
        
    print(f"[*] API Key configured: {api_key[:10]}...{api_key[-4:]}")
    
    # Initialize the agent
    agent = SarvamAgent(api_key=api_key, model="sarvam-m")
    
    print("[*] Agent is ready! (Type 'quit' or 'exit' to stop)")
    print("-" * 60)
    
    while True:
        try:
            user_input = input("\nYou: ")
            if user_input.lower() in ['quit', 'exit']:
                print("Goodbye!")
                break
                
            if not user_input.strip():
                continue
                
            print("SURAJ is thinking...")
            response = agent.chat(user_input)
            print(f"\nSURAJ:\n{response}")
            
        except KeyboardInterrupt:
            print("\nGoodbye!")
            break
        except Exception as e:
            print(f"\nAn error occurred: {e}")

if __name__ == "__main__":
    main()
