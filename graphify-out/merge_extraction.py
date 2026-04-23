import json
from pathlib import Path

def merge():
    ast_path = Path('graphify-out/.graphify_ast.json')
    sem_path = Path('graphify-out/.graphify_semantic.json')
    
    if not ast_path.exists() or not sem_path.exists():
        print("Error: Required extraction files not found")
        return
        
    ast = json.loads(ast_path.read_text())
    sem = json.loads(sem_path.read_text())
    
    # Merge nodes
    seen = {n['id'] for n in ast['nodes']}
    merged_nodes = list(ast['nodes'])
    for n in sem['nodes']:
        if n['id'] not in seen:
            merged_nodes.append(n)
            seen.add(n['id'])
            
    # Merge edges
    merged_edges = ast['edges'] + sem['edges']
    
    merged = {
        'nodes': merged_nodes,
        'edges': merged_edges,
        'hyperedges': [],
        'input_tokens': 0,
        'output_tokens': 0
    }
    
    output_path = Path('graphify-out/.graphify_extract.json')
    output_path.write_text(json.dumps(merged, indent=2))
    print(f"Merged: {len(merged_nodes)} nodes, {len(merged_edges)} edges")

if __name__ == "__main__":
    merge()
