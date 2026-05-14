export interface InstructorBio {
  title: string;
  bio: string;
  courses: number;
  learners: number;
}

export const instructorBios: Record<string, InstructorBio> = {
  "Rahul Menon": {
    title: "AI Engineer & E-commerce Specialist",
    bio: "Rahul has 8 years of experience building e-commerce automation systems. He previously worked with Flipkart's AI team and now runs his own AI consulting practice serving D2C brands across India.",
    courses: 3,
    learners: 18400,
  },
  "Aishwarya Krishnan": {
    title: "Fintech AI Specialist",
    bio: "Aishwarya is a fintech engineer who has built credit scoring systems for NBFC clients. She holds an MTech in Machine Learning from IIT Madras and specialises in risk modelling and financial NLP.",
    courses: 2,
    learners: 11200,
  },
  "Dr. Priya Nambiar": {
    title: "Healthcare AI Researcher",
    bio: "Dr. Priya holds a PhD in Biomedical Informatics and spent 6 years at Apollo Hospitals building clinical AI tools. She is one of India's leading voices on responsible AI in healthcare.",
    courses: 2,
    learners: 9800,
  },
  "Vikram Suresh": {
    title: "Legal Tech Engineer",
    bio: "Vikram spent 5 years at a Big Four firm automating contract review workflows before founding his own legal-tech startup. He is the author of 'AI for Lawyers' — a widely read guide on LLMs in legal practice.",
    courses: 2,
    learners: 13000,
  },
  "Meera Pillai": {
    title: "Sustainability Data Scientist",
    bio: "Meera leads sustainability analytics at a Fortune 500 consulting firm. She has built ESG reporting tools used by 40+ listed companies and advises startups on climate data infrastructure.",
    courses: 1,
    learners: 7800,
  },
  "Anand Rajan": {
    title: "Computer Vision Engineer",
    bio: "Anand has deployed computer vision systems at Toyota, Tata Steel, and several tier-2 auto-component manufacturers. He is a YOLO contributor and maintains open-source tools for edge ML deployment.",
    courses: 3,
    learners: 14500,
  },
  "Sanjay Iyer": {
    title: "AI Educator & LLM Specialist",
    bio: "Sanjay has taught AI to over 45,000 students across cohort and async formats. He was previously a Research Engineer at Hugging Face and simplifies complex transformer concepts better than anyone in the space.",
    courses: 4,
    learners: 54000,
  },
  "Deepa Varma": {
    title: "RAG Systems Architect",
    bio: "Deepa has built RAG pipelines for enterprise clients in banking, insurance, and e-commerce. She is a Weaviate community ambassador and runs a popular newsletter on production retrieval systems.",
    courses: 2,
    learners: 32000,
  },
  "Karthik Nair": {
    title: "Multi-Agent Systems Engineer",
    bio: "Karthik is one of India's foremost practitioners of agentic AI, having built autonomous systems for logistics, procurement, and customer service. He is a regular speaker at AI conferences across APAC.",
    courses: 3,
    learners: 23000,
  },
  "Divya Krishnan": {
    title: "Computer Vision Production Specialist",
    bio: "Divya specialises in taking CV models from research to production. She has led computer vision teams at Ola and PhonePe, and has published three papers on model compression for edge devices.",
    courses: 2,
    learners: 26000,
  },
  "Arjun Menon": {
    title: "MLOps Engineer",
    bio: "Arjun is an MLOps practitioner who has designed CI/CD pipelines for ML teams at scale-ups and enterprises. He holds GCP and AWS ML certifications and contributes to MLflow and Kubeflow.",
    courses: 3,
    learners: 21000,
  },
  "Nithya Suresh": {
    title: "E-commerce AI Specialist",
    bio: "Nithya has built recommendation and search systems for Myntra, Nykaa, and several D2C brands. She holds an MSc in Information Retrieval and is passionate about personalisation at scale.",
    courses: 2,
    learners: 37000,
  },
};
