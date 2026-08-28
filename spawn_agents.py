import json
import os
import time

hive_dir = r"C:\Users\dhruv\HarnessAgents\hive"
registry_path = os.path.join(hive_dir, "registry.json")

# Load registry
with open(registry_path, "r") as f:
    data = json.load(f)

# Define the dream team
new_agents = {
    "frontend-expert": {"name": "Pam", "role": "Frontend React Engineer"},
    "backend-expert": {"name": "Dwight", "role": "Backend Spring Boot Engineer"},
    "ui-designer": {"name": "Kelly", "role": "Tailwind UI Designer"},
    "db-expert": {"name": "Oscar", "role": "PostgreSQL Architect"}
}

for agent_id, info in new_agents.items():
    # Add to registry
    data["agents"][agent_id] = {
        "id": agent_id,
        "name": info["name"],
        "provider": "antigravity",
        "cwd": r"C:\Users\dhruv\Desktop\stocksss",
        "isGod": False,
        "role": info["role"],
        "capabilities": [],
        "status": "idle",
        "cwdValid": True,
        "archived": False,
        "lastSeen": int(time.time() * 1000)
    }
    
    # Create directories
    agent_dir = os.path.join(hive_dir, "agents", agent_id)
    os.makedirs(os.path.join(agent_dir, "inbox", ".done"), exist_ok=True)
    os.makedirs(os.path.join(agent_dir, "outbox"), exist_ok=True)
    
    # Create identity file
    with open(os.path.join(agent_dir, "identity.md"), "w") as f:
        f.write(f"You are {info['name']}, the {info['role']}. You work in C:\\Users\\dhruv\\Desktop\\stocksss.")
        
    # Create memory file
    with open(os.path.join(agent_dir, "memory.md"), "w") as f:
        f.write("Initial memory empty.")

# Save registry
with open(registry_path, "w") as f:
    json.dump(data, f, indent=2)

print("Dream team spawned successfully!")
