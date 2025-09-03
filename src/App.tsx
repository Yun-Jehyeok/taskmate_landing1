import { useState } from "react";

const FORMSPREE_URL = import.meta.env.VITE_FORMSPREE_URL;

function App() {
    const [status, setStatus] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedbackType, setFeedbackType] = useState<"free" | "premium">("free");
    const [agree, setAgree] = useState(false);
    const [formData, setFormData] = useState({
        github: "",
        content: "",
        email: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const isFormValid = formData.github.trim() !== "" && formData.content.trim() !== "" && formData.email.trim() !== "" && agree;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus("");

        const data = new FormData();
        data.append("github", formData.github);
        data.append("content", formData.content);
        data.append("email", formData.email);
        data.append("feedbackType", feedbackType);

        try {
            const response = await fetch(FORMSPREE_URL, {
                method: "POST",
                body: data,
                headers: {
                    Accept: "application/json",
                },
            });

            if (response.ok) {
                setStatus("success");
                setFormData({ github: "", content: "", email: "" });
                setAgree(false);
            } else {
                setStatus("error");
            }
        } catch (error) {
            setStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-screen min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">리뷰 요청하기</h1>
                    <p className="text-gray-600">AI에게 코드 리뷰를 받아보세요!</p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 mb-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* GitHub URL Input */}
                        <div className="space-y-2">
                            <label htmlFor="github" className="block text-sm font-medium text-gray-700">
                                GitHub 저장소 주소 (Public)
                            </label>
                            <input
                                type="url"
                                id="github"
                                name="github"
                                value={formData.github}
                                onChange={handleInputChange}
                                placeholder="https://github.com/username/repository"
                                required
                                className="block w-full px-3 py-3 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                            />
                        </div>

                        {/* Content Textarea */}
                        <div className="space-y-2">
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                                리뷰 받고 싶은 내용
                            </label>
                            <textarea
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleInputChange}
                                placeholder="어떤 부분에 대한 리뷰를 받고 싶으신가요?"
                                required
                                rows={4}
                                className="block w-full px-3 py-3 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out resize-none"
                            />
                        </div>

                        {/* Email Input */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                이메일 주소
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="your.email@example.com"
                                required
                                className="block w-full px-3 py-3 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                            />
                        </div>
                    </form>
                </div>

                {/* Pricing Selection */}
                <div className="bg-white rounded-2xl shadow-xl p-4 mb-6 border border-gray-100">
                    <h2 className="text-base font-semibold text-gray-800 mb-3 text-center">피드백 유형 선택</h2>
                    <div className="grid grid-cols-1 gap-3">
                        <button
                            type="button"
                            onClick={() => setFeedbackType("free")}
                            className={`p-3 rounded-lg border-2 ${feedbackType === "free" ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-gray-50"}`}
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-800 text-sm">무료 피드백</h3>
                                <span className="text-lg font-bold text-green-600">₩0</span>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setFeedbackType("premium")}
                            className={`p-3 rounded-lg border-2 ${feedbackType === "premium" ? "border-purple-500 bg-purple-50" : "border-gray-200 bg-gray-50"}`}
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-800 text-sm">일반 피드백</h3>
                                <span className="text-lg font-bold text-purple-600">₩4,900</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                    <button
                        type="button"
                        disabled={isSubmitting || !isFormValid}
                        onClick={(e) => {
                            e.preventDefault();
                            handleSubmit(e as any);
                        }}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "제출 중..." : feedbackType === "free" ? "무료 리뷰 요청하기" : "일반 리뷰 요청하기"}
                    </button>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-sm text-gray-500">제출해주신 이메일은 피드백 및 서비스 안내 외의 목적으로 사용되지 않습니다.</p>
                </div>
            </div>
        </div>
    );
}

export default App;
