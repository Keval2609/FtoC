import json
from graphify.build import build_from_json
from graphify.cluster import cluster, score_all
from graphify.analyze import god_nodes, surprising_connections, suggest_questions
from graphify.report import generate
from graphify.export import to_json
from pathlib import Path

def run():
    extraction_path = Path('graphify-out/.graphify_extract.json')
    detection_path = Path('graphify-out/.graphify_detect.json')
    
    if not extraction_path.exists() or not detection_path.exists():
        print("Error: Missing files for graph build")
        return
        
    extraction = json.loads(extraction_path.read_text())
    detection = json.loads(detection_path.read_text())
    
    print("Building graph...")
    G = build_from_json(extraction)
    
    print("Clustering...")
    communities = cluster(G)
    cohesion = score_all(G, communities)
    
    print("Analyzing...")
    gods = god_nodes(G)
    surprises = surprising_connections(G, communities)
    
    # Simple labels for now, Step 5 will refine them
    labels = {cid: f'Community {cid}' for cid in communities}
    questions = suggest_questions(G, communities, labels)
    
    print("Generating report...")
    report = generate(G, communities, cohesion, labels, gods, surprises, detection, {'input':0, 'output':0}, '.', suggested_questions=questions)
    Path('graphify-out/GRAPH_REPORT.md').write_text(report)
    
    print("Exporting graph...")
    to_json(G, communities, 'graphify-out/graph.json')
    
    analysis = {
        'communities': {str(k): v for k, v in communities.items()},
        'cohesion': {str(k): v for k, v in cohesion.items()},
        'gods': gods,
        'surprises': surprises,
        'questions': questions,
    }
    Path('graphify-out/.graphify_analysis.json').write_text(json.dumps(analysis, indent=2))
    print(f"Graph ready: {G.number_of_nodes()} nodes, {G.number_of_edges()} edges, {len(communities)} communities")

if __name__ == "__main__":
    run()
