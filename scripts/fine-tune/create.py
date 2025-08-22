# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "langchain",
#   "langchain-openai",
#   "langchain-community",
# ]
# ///

import json
import logging
import sys
import os
from pathlib import Path
from typing import List, Dict, Any, Tuple
from dataclasses import dataclass, asdict
from datetime import datetime

from langchain.text_splitter import MarkdownTextSplitter
from langchain_community.document_loaders import TextLoader
from langchain_openai import ChatOpenAI

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class TrainingExample:
    """Represents a training example with metadata."""
    content: str
    example_type: str  # 'documentation', 'code_example', 'troubleshooting', 'integration'
    source_file: str
    chunk_index: int

@dataclass
class Checkpoint:
    """Represents a checkpoint for resuming progress."""
    timestamp: str
    processed_chunks: List[int]
    processed_code_examples: List[str]
    training_data: List[Dict[str, Any]]
    total_doc_chunks: int
    total_code_examples: int
    integration_generated: bool
    code_generation_generated: bool

class CheckpointManager:
    """Manages saving and loading checkpoints."""
    
    def __init__(self, checkpoint_file: str = "fine_tune_checkpoint.json"):
        self.checkpoint_file = checkpoint_file
    
    def save_checkpoint(self, checkpoint: Checkpoint):
        """Save checkpoint to file."""
        try:
            with open(self.checkpoint_file, 'w', encoding='utf-8') as f:
                json.dump(asdict(checkpoint), f, indent=2)
            logger.info(f"Checkpoint saved: {len(checkpoint.training_data)} examples, {len(checkpoint.processed_chunks)} doc chunks, {len(checkpoint.processed_code_examples)} code examples")
        except Exception as e:
            logger.error(f"Failed to save checkpoint: {e}")
    
    def load_checkpoint(self) -> Checkpoint:
        """Load checkpoint from file."""
        try:
            if Path(self.checkpoint_file).exists():
                with open(self.checkpoint_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                checkpoint = Checkpoint(**data)
                logger.info(f"Checkpoint loaded: {len(checkpoint.training_data)} examples, {len(checkpoint.processed_chunks)} doc chunks, {len(checkpoint.processed_code_examples)} code examples")
                return checkpoint
        except Exception as e:
            logger.error(f"Failed to load checkpoint: {e}")
        
        # Return empty checkpoint if no file or error
        return Checkpoint(
            timestamp=datetime.now().isoformat(),
            processed_chunks=[],
            processed_code_examples=[],
            training_data=[],
            total_doc_chunks=0,
            total_code_examples=0,
            integration_generated=False,
            code_generation_generated=False
        )
    
    def clear_checkpoint(self):
        """Clear the checkpoint file."""
        try:
            if Path(self.checkpoint_file).exists():
                Path(self.checkpoint_file).unlink()
                logger.info("Checkpoint cleared")
        except Exception as e:
            logger.error(f"Failed to clear checkpoint: {e}")

def load_and_split_documents(file_path: str, chunk_size: int = 2000, chunk_overlap: int = 200) -> List[TrainingExample]:
    """Load and split documentation into chunks."""
    logger.info(f"Loading documentation from {file_path}")
    
    if not Path(file_path).exists():
        logger.error(f"File not found: {file_path}")
        raise FileNotFoundError(f"File not found: {file_path}")
    
    try:
        loader = TextLoader(file_path)
        documents = loader.load()
        logger.info(f"Loaded {len(documents)} document(s)")
        
        splitter = MarkdownTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
        splits = splitter.split_documents(documents)
        logger.info(f"Split into {len(splits)} chunks")
        
        examples = []
        for i, split in enumerate(splits):
            examples.append(TrainingExample(
                content=split.page_content,
                example_type="documentation",
                source_file=file_path,
                chunk_index=i
            ))
        
        return examples
    except Exception as e:
        logger.error(f"Error loading/splitting documents: {e}")
        raise

def load_typescript_examples(examples_dir: str = "../../examples") -> List[TrainingExample]:
    """Load TypeScript examples from the examples directory."""
    logger.info(f"Loading TypeScript examples from {examples_dir}")
    
    examples = []
    examples_path = Path(examples_dir)
    
    if not examples_path.exists():
        logger.warning(f"Examples directory not found: {examples_dir}")
        return examples
    
    # Common TypeScript/React file extensions
    ts_extensions = {'.ts', '.tsx', '.js', '.jsx', '.mjs'}
    
    for root, dirs, files in os.walk(examples_path):
        for file in files:
            if Path(file).suffix in ts_extensions:
                file_path = Path(root) / file
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Skip empty files
                    if content.strip():
                        examples.append(TrainingExample(
                            content=content,
                            example_type="code_example",
                            source_file=str(file_path),
                            chunk_index=len(examples)
                        ))
                        logger.debug(f"Loaded code example: {file_path}")
                        
                except Exception as e:
                    logger.warning(f"Failed to load {file_path}: {e}")
    
    logger.info(f"Loaded {len(examples)} TypeScript examples")
    return examples

def generate_documentation_qa(llm: ChatOpenAI, content: str, chunk_index: int) -> List[Dict[str, str]]:
    """Generate Q&A pairs for documentation chunks."""
    prompt = f"""
    Based on this documentation:
    {content}
    
    Generate 3 different user questions and answers in JSON format.
    Each should be a realistic question a developer would ask.
    Include questions about:
    - How to use specific features
    - What certain components do
    - Why certain design decisions were made
    - When to use different approaches
    
    Format: [{{"question": "...", "answer": "..."}}]
    
    Make sure the response is valid JSON and each question-answer pair is realistic and helpful.
    """
    
    try:
        logger.info(f"Generating documentation Q&A for chunk {chunk_index + 1}")
        response = llm.invoke(prompt)
        
        pairs = json.loads(response.content)
        
        if not isinstance(pairs, list):
            logger.warning(f"Chunk {chunk_index + 1}: Response is not a list, skipping")
            return []
        
        valid_pairs = []
        for i, pair in enumerate(pairs):
            if isinstance(pair, dict) and "question" in pair and "answer" in pair:
                if pair["question"].strip() and pair["answer"].strip():
                    valid_pairs.append(pair)
                else:
                    logger.warning(f"Chunk {chunk_index + 1}, pair {i + 1}: Empty question or answer")
            else:
                logger.warning(f"Chunk {chunk_index + 1}, pair {i + 1}: Invalid pair format")
        
        logger.info(f"Chunk {chunk_index + 1}: Generated {len(valid_pairs)} valid Q&A pairs")
        return valid_pairs
        
    except json.JSONDecodeError as e:
        logger.error(f"Chunk {chunk_index + 1}: Failed to parse JSON response: {e}")
        return []
    except Exception as e:
        logger.error(f"Chunk {chunk_index + 1}: Error generating Q&A pairs: {e}")
        return []

def generate_code_qa(llm: ChatOpenAI, content: str, source_file: str, chunk_index: int) -> List[Dict[str, str]]:
    """Generate Q&A pairs for TypeScript code examples."""
    prompt = f"""
    Based on this TypeScript/React code example:
    {content}
    
    Generate 4 different user questions and answers in JSON format.
    Include questions about:
    - How to implement this pattern
    - What each part of the code does
    - How to customize or extend this example
    - Common issues and troubleshooting
    - Best practices demonstrated
    
    Format: [{{"question": "...", "answer": "..."}}]
    
    Make sure the response is valid JSON and each question-answer pair is realistic and helpful.
    Focus on practical implementation questions that developers would ask.
    """
    
    try:
        logger.info(f"Generating code Q&A for {Path(source_file).name}")
        response = llm.invoke(prompt)
        
        pairs = json.loads(response.content)
        
        if not isinstance(pairs, list):
            logger.warning(f"Code example {chunk_index + 1}: Response is not a list, skipping")
            return []
        
        valid_pairs = []
        for i, pair in enumerate(pairs):
            if isinstance(pair, dict) and "question" in pair and "answer" in pair:
                if pair["question"].strip() and pair["answer"].strip():
                    valid_pairs.append(pair)
                else:
                    logger.warning(f"Code example {chunk_index + 1}, pair {i + 1}: Empty question or answer")
            else:
                logger.warning(f"Code example {chunk_index + 1}, pair {i + 1}: Invalid pair format")
        
        logger.info(f"Code example {chunk_index + 1}: Generated {len(valid_pairs)} valid Q&A pairs")
        return valid_pairs
        
    except json.JSONDecodeError as e:
        logger.error(f"Code example {chunk_index + 1}: Failed to parse JSON response: {e}")
        return []
    except Exception as e:
        logger.error(f"Code example {chunk_index + 1}: Error generating Q&A pairs: {e}")
        return []

def generate_code_generation_examples(llm: ChatOpenAI, all_examples: List[TrainingExample]) -> List[Dict[str, Any]]:
    """Generate code generation instruction-following examples."""
    logger.info("Generating code generation examples")
    
    # Get some documentation and code examples for context
    doc_examples = [ex for ex in all_examples if ex.example_type == "documentation"][:3]
    code_examples = [ex for ex in all_examples if ex.example_type == "code_example"][:2]
    
    combined_context = "\n\n".join([
        f"Documentation: {ex.content[:800]}..." for ex in doc_examples
    ] + [
        f"Code Example: {ex.content[:800]}..." for ex in code_examples
    ])
    
    prompt = f"""
    Based on this Voice UI Kit documentation and code examples:
    {combined_context}
    
    Generate 8 code generation instruction-following examples in JSON format.
    Each should include an instruction and the expected code implementation.
    
    Include different types of requests:
    - Create a basic voice chat component
    - Implement a custom theme
    - Add error handling to a component
    - Create a new template
    - Integrate with a specific framework
    - Add custom styling
    - Implement specific functionality
    - Create a complete example app
    
    Format: [
        {{
            "instruction": "Create a voice chat component that...",
            "implementation": "```tsx\\nimport {{ ... }} from '@pipecat-ai/voice-ui-kit';\\n\\nexport function VoiceChat() {{...}}\\n```"
        }}
    ]
    
    Make sure the response is valid JSON and each implementation includes proper imports and complete, working code.
    """
    
    try:
        response = llm.invoke(prompt)
        examples = json.loads(response.content)
        
        if not isinstance(examples, list):
            logger.warning("Code generation examples: Response is not a list, skipping")
            return []
        
        valid_examples = []
        for i, example in enumerate(examples):
            if isinstance(example, dict) and "instruction" in example and "implementation" in example:
                if example["instruction"].strip() and example["implementation"].strip():
                    valid_examples.append(example)
                else:
                    logger.warning(f"Code generation example {i + 1}: Empty instruction or implementation")
            else:
                logger.warning(f"Code generation example {i + 1}: Invalid format")
        
        logger.info(f"Generated {len(valid_examples)} code generation examples")
        return valid_examples
        
    except Exception as e:
        logger.error(f"Error generating code generation examples: {e}")
        return []

def generate_integration_examples(llm: ChatOpenAI, all_examples: List[TrainingExample]) -> List[Dict[str, str]]:
    """Generate integration and troubleshooting examples."""
    logger.info("Generating integration and troubleshooting examples")
    
    # Combine some documentation and code examples for integration questions
    combined_content = "\n\n".join([
        f"Documentation: {ex.content[:500]}..." if ex.example_type == "documentation" 
        else f"Code Example: {ex.content[:500]}..."
        for ex in all_examples[:5]  # Use first 5 examples
    ])
    
    prompt = f"""
    Based on this Voice UI Kit documentation and code examples:
    {combined_content}
    
    Generate 5 integration and troubleshooting questions and answers in JSON format.
    Include questions about:
    - How to integrate with different frameworks (Next.js, React, Vite)
    - How to handle common errors and debugging
    - How to customize themes and styling
    - How to implement specific use cases
    - Performance optimization tips
    
    Format: [{{"question": "...", "answer": "..."}}]
    
    Make sure the response is valid JSON and each question-answer pair is realistic and helpful.
    """
    
    try:
        response = llm.invoke(prompt)
        pairs = json.loads(response.content)
        
        if not isinstance(pairs, list):
            logger.warning("Integration examples: Response is not a list, skipping")
            return []
        
        valid_pairs = []
        for i, pair in enumerate(pairs):
            if isinstance(pair, dict) and "question" in pair and "answer" in pair:
                if pair["question"].strip() and pair["answer"].strip():
                    valid_pairs.append(pair)
        
        logger.info(f"Generated {len(valid_pairs)} integration examples")
        return valid_pairs
        
    except Exception as e:
        logger.error(f"Error generating integration examples: {e}")
        return []

def create_comprehensive_training_data_with_checkpoints(
    all_examples: List[TrainingExample], 
    llm: ChatOpenAI,
    checkpoint_manager: CheckpointManager
) -> List[Dict[str, Any]]:
    """Create comprehensive training data from all sources with checkpointing."""
    
    # Load existing checkpoint
    checkpoint = checkpoint_manager.load_checkpoint()
    training_data = checkpoint.training_data
    
    logger.info(f"Starting to generate comprehensive training data from {len(all_examples)} examples")
    logger.info(f"Resuming from checkpoint: {len(training_data)} examples already generated")
    
    # Process documentation examples
    doc_examples = [ex for ex in all_examples if ex.example_type == "documentation"]
    for i, example in enumerate(doc_examples):
        # Skip if already processed
        if example.chunk_index in checkpoint.processed_chunks:
            logger.info(f"Skipping already processed documentation chunk {i + 1}/{len(doc_examples)}")
            continue
            
        logger.info(f"Processing documentation chunk {i + 1}/{len(doc_examples)}")
        pairs = generate_documentation_qa(llm, example.content, example.chunk_index)
        
        for pair in pairs:
            training_data.append({
                "messages": [
                    {"role": "user", "content": pair["question"]},
                    {"role": "assistant", "content": pair["answer"]}
                ]
            })
        
        # Update checkpoint
        checkpoint.processed_chunks.append(example.chunk_index)
        checkpoint.training_data = training_data
        checkpoint.timestamp = datetime.now().isoformat()
        checkpoint_manager.save_checkpoint(checkpoint)
    
    # Process code examples
    code_examples = [ex for ex in all_examples if ex.example_type == "code_example"]
    for i, example in enumerate(code_examples):
        # Skip if already processed
        if example.source_file in checkpoint.processed_code_examples:
            logger.info(f"Skipping already processed code example {i + 1}/{len(code_examples)}: {Path(example.source_file).name}")
            continue
            
        logger.info(f"Processing code example {i + 1}/{len(code_examples)}: {Path(example.source_file).name}")
        pairs = generate_code_qa(llm, example.content, example.source_file, example.chunk_index)
        
        for pair in pairs:
            training_data.append({
                "messages": [
                    {"role": "user", "content": pair["question"]},
                    {"role": "assistant", "content": pair["answer"]}
                ]
            })
        
        # Update checkpoint
        checkpoint.processed_code_examples.append(example.source_file)
        checkpoint.training_data = training_data
        checkpoint.timestamp = datetime.now().isoformat()
        checkpoint_manager.save_checkpoint(checkpoint)
    
    # Generate integration examples (only once)
    if not checkpoint.integration_generated:
        logger.info("Generating integration examples...")
        integration_pairs = generate_integration_examples(llm, all_examples)
        for pair in integration_pairs:
            training_data.append({
                "messages": [
                    {"role": "user", "content": pair["question"]},
                    {"role": "assistant", "content": pair["answer"]}
                ]
            })
        
        checkpoint.integration_generated = True
        checkpoint.training_data = training_data
        checkpoint.timestamp = datetime.now().isoformat()
        checkpoint_manager.save_checkpoint(checkpoint)
    
    # Generate code generation examples (only once)
    if not checkpoint.code_generation_generated:
        logger.info("Generating code generation examples...")
        code_gen_examples = generate_code_generation_examples(llm, all_examples)
        for example in code_gen_examples:
            training_data.append({
                "messages": [
                    {"role": "user", "content": example["instruction"]},
                    {"role": "assistant", "content": example["implementation"]}
                ]
            })
        
        checkpoint.code_generation_generated = True
        checkpoint.training_data = training_data
        checkpoint.timestamp = datetime.now().isoformat()
        checkpoint_manager.save_checkpoint(checkpoint)
    
    return training_data

def save_training_data(training_data: List[Dict[str, Any]], output_file: str = "comprehensive_training.jsonl"):
    """Save training data to JSONL file with detailed statistics."""
    logger.info(f"Saving {len(training_data)} training examples to {output_file}")
    
    try:
        with open(output_file, "w", encoding="utf-8") as f:
            for item in training_data:
                f.write(json.dumps(item, ensure_ascii=False) + '\n')
        
        logger.info(f"Successfully saved training data to {output_file}")
        
        # Print comprehensive summary statistics
        logger.info("=== COMPREHENSIVE TRAINING DATA SUMMARY ===")
        logger.info(f"Total training examples: {len(training_data)}")
        
        # Analyze question types
        question_types = {}
        code_generation_count = 0
        
        for item in training_data:
            user_content = item["messages"][0]["content"].lower()
            
            # Check for code generation instructions
            if any(word in user_content for word in ["create", "implement", "build", "write", "generate", "make"]):
                if any(word in user_content for word in ["component", "function", "class", "code", "app", "template"]):
                    code_generation_count += 1
                    continue
            
            # Categorize other questions
            if "how" in user_content:
                question_types["how"] = question_types.get("how", 0) + 1
            elif "what" in user_content:
                question_types["what"] = question_types.get("what", 0) + 1
            elif "why" in user_content:
                question_types["why"] = question_types.get("why", 0) + 1
            elif "when" in user_content:
                question_types["when"] = question_types.get("when", 0) + 1
            elif "error" in user_content or "debug" in user_content or "troubleshoot" in user_content:
                question_types["troubleshooting"] = question_types.get("troubleshooting", 0) + 1
            elif "integrate" in user_content or "setup" in user_content or "install" in user_content:
                question_types["integration"] = question_types.get("integration", 0) + 1
            else:
                question_types["other"] = question_types.get("other", 0) + 1
        
        logger.info(f"Code generation examples: {code_generation_count}")
        for q_type, count in question_types.items():
            logger.info(f"Questions with '{q_type}': {count}")
        
        # Check for code-related questions
        code_questions = sum(1 for item in training_data 
                           if any(word in item["messages"][0]["content"].lower() 
                                 for word in ["code", "component", "import", "export", "function", "class"]))
        logger.info(f"Code-related questions: {code_questions}")
        
    except Exception as e:
        logger.error(f"Error saving training data: {e}")
        raise

def main():
    """Main function to orchestrate the comprehensive fine-tuning data generation."""
    logger.info("Starting comprehensive fine-tuning data generation process")
    
    # Initialize checkpoint manager
    checkpoint_manager = CheckpointManager()
    
    try:
        # Load documentation
        doc_examples = load_and_split_documents("data/llm-full.txt")
        
        # Load TypeScript examples
        code_examples = load_typescript_examples()
        
        # Combine all examples
        all_examples = doc_examples + code_examples
        logger.info(f"Total examples loaded: {len(all_examples)} ({len(doc_examples)} docs, {len(code_examples)} code)")
        
        # Initialize LLM
        logger.info("Initializing ChatOpenAI model")
        llm = ChatOpenAI(model="gpt-4")
        
        # Generate comprehensive training data with checkpointing
        training_data = create_comprehensive_training_data_with_checkpoints(all_examples, llm, checkpoint_manager)
        
        if not training_data:
            logger.error("No training data generated. Exiting.")
            return
        
        # Save training data
        save_training_data(training_data)
        
        # Clear checkpoint after successful completion
        checkpoint_manager.clear_checkpoint()
        
        logger.info("Comprehensive fine-tuning data generation completed successfully!")
        
    except Exception as e:
        logger.error(f"Error in main process: {e}")
        logger.info("Progress has been saved. You can resume by running the script again.")
        raise

if __name__ == "__main__":
    main()
