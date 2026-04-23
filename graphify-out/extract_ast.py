import json
from graphify.extract import extract
from pathlib import Path

def run():
    detect_path = Path('graphify-out/.graphify_detect.json')
    if not detect_path.exists():
        print("Error: detect file not found")
        return
        
    detect = json.loads(detect_path.read_text())
    code_files = [Path(f) for f in detect['files']['code']]
    
    print(f"Extracting AST from {len(code_files)} files...")
    result = extract(code_files)
    
    output_path = Path('graphify-out/.graphify_ast.json')
    output_path.write_text(json.dumps(result, indent=2))
    print(f"AST: {len(result['nodes'])} nodes, {len(result['edges'])} edges")

if __name__ == "__main__":
    run()
