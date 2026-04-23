import json
from graphify.build import build_from_json
from graphify.cluster import score_all
from graphify.analyze import god_nodes, surprising_connections, suggest_questions
from graphify.report import generate
from graphify.export import to_html
from pathlib import Path

def label_and_viz():
    extraction_path = Path('graphify-out/.graphify_extract.json')
    analysis_path = Path('graphify-out/.graphify_analysis.json')
    detection_path = Path('graphify-out/.graphify_detect.json')
    
    if not extraction_path.exists() or not analysis_path.exists() or not detection_path.exists():
        print("Error: Missing files for labeling and visualization")
        return
        
    extraction = json.loads(extraction_path.read_text())
    analysis = json.loads(analysis_path.read_text())
    detection = json.loads(detection_path.read_text())
    
    communities = {int(k): v for k, v in analysis['communities'].items()}
    
    labels = {
        0: "Marketplace Core Concepts",
        1: "Cart Management State",
        2: "Authentication Logic",
        3: "Firestore Data Access",
        4: "Design System & Branding",
        5: "Auth Context",
        6: "Theme Management",
        7: "Mock Data Services",
        8: "Main App Entry",
        9: "Google Sign-In",
        10: "Route Protection",
        11: "Checkout Contact Form",
        12: "Checkout Delivery Form",
        13: "Order Summary",
        14: "Payment Form",
        15: "Farmer Discovery Card",
        16: "Discovery Filtering",
        17: "Search Functionality",
        18: "App Layout Shell",
        19: "Profile Hero",
        20: "Farming Methods",
        21: "Product Grid",
        22: "Verification Gallery",
        23: "Common UI Button",
        24: "Image Loading",
        25: "Product Card",
        26: "Dark Mode Toggle",
        27: "Transparency Visualization",
        28: "Trust Verification Badge",
        29: "Checkout Page",
        30: "Discovery Page",
        31: "Farmer Profile Page",
        32: "Login Page",
        33: "Registration Page",
        34: "Farmer Dashboard",
    }
    
    # Fallback for remaining
    for cid in communities:
        if cid not in labels:
            labels[cid] = f"Config & Setup ({cid})"
            
    G = build_from_json(extraction)
    cohesion = score_all(G, communities)
    gods = god_nodes(G)
    surprises = surprising_connections(G, communities)
    questions = suggest_questions(G, communities, labels)
    
    print("Updating report with labels...")
    report = generate(G, communities, cohesion, labels, gods, surprises, detection, {'input':0, 'output':0}, '.', suggested_questions=questions)
    Path('graphify-out/GRAPH_REPORT.md').write_text(report)
    
    print("Generating interactive visualization...")
    # Correct signature: (G, communities, output_path, community_labels)
    to_html(G, communities, 'graphify-out/index.html', labels)
    
    # Save labels for persistence
    Path('graphify-out/.graphify_labels.json').write_text(json.dumps({str(k): v for k, v in labels.items()}, indent=2))
    print("Graphify complete!")

if __name__ == "__main__":
    run_label_and_viz = label_and_viz # ensure we can call it
    label_and_viz()
