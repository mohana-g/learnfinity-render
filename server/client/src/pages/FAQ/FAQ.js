import React, { useState } from "react";
import "./FAQ.css";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  //const [userQuestion, setUserQuestion] = useState(""); // Store the user's question

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Can I customize eLearning courses?",
      answer: "Yes, eLearning courses can be customized according to your needs, including content, duration, and delivery methods.",
    },
    {
      question: "How much does an eLearning course cost?",
      answer:
        "E-learning is a one-time investment, and once you have your course, you can use it as many times as you want. Costs depend on content, customization, and delivery method.",
    },
    {
      question: "What is the refund policy?",
      answer: "Refund policies vary by course provider. Please refer to the terms and conditions for detailed information.",
    },
    {
      question: "Can I download the course certificate after completing the course?",
      answer:
        "Yes, once you have completed all the course requirements, you can download your course certificate directly from your dashboard.",
    },
    {
      question: "How can I enroll in a course?",
      answer:
        "To enroll in a course, simply browse through the available courses, select the one you wish to enroll in, and click the 'Enroll' button. You will need to log in or sign up to complete the enrollment process.",
    },
  ];
/*
  const handleQuestionChange = (event) => {
    setUserQuestion(event.target.value); // Update the user's question as they type
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent form submission from reloading the page
    if (userQuestion.trim()) {
      // If there is a question, log it or send it to an API
      console.log("Submitted Question: ", userQuestion);
      setUserQuestion(""); // Clear the textarea after submission
    } else {
      alert("Please enter a question.");
    }
  };
*/
  return (
    <div className="faq-container">
      <div className="faq-main">
        <h1>Frequently Asked Questions</h1>
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${activeIndex === index ? "active" : ""}`}
            onClick={() => toggleFAQ(index)}
          >
            <div className="faq-question">
              {activeIndex === index ? "-" : "+"} {faq.question}
            </div>
            {activeIndex === index && <div className="faq-answer">{faq.answer}</div>}
          </div>
        ))}
        {/*
        <div className="faq-form">
          <label htmlFor="question">Questions:</label>
          <textarea
            id="question"
            className="faq-textarea"
            placeholder="Ask your question here..."
            value={userQuestion} // Bind the value of the textarea to the state
            onChange={handleQuestionChange} // Update the state when the user types
          ></textarea>
          <button className="faq-submit" onClick={handleSubmit}>
            Submit
          </button>
        </div>*/}
      </div>
    </div>
  );
};

export default FAQ;
