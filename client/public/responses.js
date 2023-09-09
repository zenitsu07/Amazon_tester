function suggestFollowUpQuestions(userInput) {
    // Define follow-up questions based on user's initial query
    const followUpQuestions = {
        "What is Amazon Prime": [
            "How much does Amazon Prime cost?",
            "What are the benefits of Amazon Prime Video?",
            "Can I share my Amazon Prime membership with family members?"
        ],
        "How can I track my order": [
            "How long does it usually take for an order to arrive?",
            "Can I change the delivery address for my order?",
            "What should I do if my order is delayed?"
        ],
        "How do I get Amazon Prime membership": [
            "What's included in the Amazon Prime membership?",
            "Are there any discounts for students or military members?",
            "How can I cancel my Amazon Prime membership if needed?"
        ],
        "Tell me more about Amazon Prime Video.": [
            "What are some popular shows on Amazon Prime Video?",
            "Can I download content to watch offline?",
            "Is parental control available for content on Prime Video?"
        ],
        "How does Amazon recommend products to users?": [
            "Does Amazon use machine learning for recommendations?",
            "Can I customize my product recommendations?",
            "How can I clear my browsing history on Amazon?"
        ],
        "Can I sell products on Amazon?": [
            "What types of products can I sell on Amazon?",
            "How do I create product listings?",
            "What fees are associated with selling on Amazon?"
        ]
    };

    userInput = userInput.trim(); // Remove leading/trailing spaces
    const followUpOptions = followUpQuestions[userInput];

    if (followUpOptions) {
        // If follow-up questions are available, return them
        return followUpOptions;
    } else {
        // If no specific follow-up questions, return a default message
        return ["Is there anything else you would like to know about Amazon?"];
    }
}

function getBotResponse(userInput) {

    const greetings = [
        "Hello! How can I assist you today?",
        "Hi there! How can I help you with Amazon?",
        "Welcome! How can I answer your questions about Amazon?"
    ];

    const commonQuestions = [
        {
            question: "What is Amazon Prime",
            answer: "Amazon Prime is a subscription service that offers benefits like free shipping, streaming of movies and TV shows, and more. It's a great way to get the most out of Amazon."
        },
        {
            question: "How can I track my order",
            answer: "You can easily track your order by going to the 'Order History' section of your Amazon account. There, you'll find real-time updates on your order's status."
        },
        {
            question: "What is the return policy",
            answer: "Amazon has a generous return policy. Most items can be returned within 30 days of delivery. Just go to your order history and initiate a return process."
        },
        {
            question: "How do I get Amazon Prime membership",
            answer: "You can sign up for Amazon Prime on the Amazon website. It offers a 30-day free trial, after which you can choose to subscribe for a monthly or annual fee."
        }
    ];

    const servicesInfo = [
        {
            question: "Tell me more about Amazon Prime Video.",
            answer: "Amazon Prime Video is a streaming service that offers a wide range of movies, TV shows, and original content. It's included with an Amazon Prime membership."
        },
        {
            question: "What is Amazon Web Services (AWS)?",
            answer: "AWS is a cloud computing platform by Amazon. It provides various services like hosting, storage, and machine learning capabilities for businesses and developers."
        },
        {
            question: "How does Amazon ensure product quality?",
            answer: "Amazon has a rigorous quality control process for products sold on its platform. It includes seller performance metrics, customer reviews, and returns monitoring to maintain quality."
        }
    ];

    const ecommerceInsights = [
        {
            question: "What are Amazon's best-selling products?",
            answer: "Amazon's best-selling products vary by category and region. You can check the 'Best Sellers' section on the Amazon website to see current top-selling items."
        },
        {
            question: "How does Amazon recommend products to users?",
            answer: "Amazon uses algorithms and machine learning to recommend products based on a user's browsing and purchase history. This helps personalize the shopping experience."
        },
        {
            question: "Can I sell products on Amazon?",
            answer: "Yes, you can become a seller on Amazon's platform. They offer various seller programs like Amazon Seller Central for individuals and businesses to list and sell products."
        }
    ];

    const fallback = [
        "I'm sorry, I couldn't understand that. Could you please rephrase your question?",
        "I'm not sure I have the information you're looking for. Can you provide more details?",
        "I apologize, but I don't have the answer to that question. Is there anything else I can assist you with?"
    ];

    userInput = userInput.toLowerCase(); 
    // Check for greetings
    if (userInput.includes("hello") || userInput.includes("hi") || userInput.includes("hey")) {
        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    // Check for common questions
    for (const qna of commonQuestions) {
        if (userInput.includes(qna.question.toLowerCase())) {
            const followUp = suggestFollowUpQuestions(qna.question);
            return [qna.answer, 'Want to Know more? Suggestions:' , ...followUp ];
        }
    }
    
    for (const qna of servicesInfo) {
        if (userInput.includes(qna.question.toLowerCase())) {
            const followUp = suggestFollowUpQuestions(qna.question);
            return [qna.answer, 'Want to Know more? Suggestions:', ...followUp];
        }
    }
    for (const qna of ecommerceInsights) {
        if (userInput.includes(qna.question.toLowerCase())) {
            const followUp = suggestFollowUpQuestions(qna.question);
            return [qna.answer, 'Want to Know more? Suggestions:', ...followUp];
        }
    }
    
    
    // Fallback for unknown queries
    return fallback[Math.floor(Math.random() * fallback.length)];
}

// // Example usage:
// const userInput = "What is Amazon Prime?";
// const botResponses = getBotResponse(userInput);
// console.log(botResponses);
