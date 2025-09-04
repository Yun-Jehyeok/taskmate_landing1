import { useState } from "react";

const FORMSPREE_URL = import.meta.env.VITE_FORMSPREE_URL;

function App() {
    const [status, setStatus] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const feedbackType = "free";
    // const [feedbackType, setFeedbackType] = useState<"free" | "premium">("free");
    const [showExampleModal, setShowExampleModal] = useState(false);
    const [showTrustModal, setShowTrustModal] = useState(false);
    const [trustScore, setTrustScore] = useState<number | null>(null);
    const [showThanksModal, setShowThanksModal] = useState(false);
    const [lastSubmittedEmail, setLastSubmittedEmail] = useState<string>("");
    const [formData, setFormData] = useState({
        github: "",
        content: "",
        email: "",
        source: "",
    });

    const handleTrustSelect = async (score: number) => {
        setTrustScore(score);
        setShowTrustModal(false);
        setShowThanksModal(true);

        try {
            const trustData = new FormData();
            trustData.append("email", lastSubmittedEmail || "");
            trustData.append("trustScore", String(score));
            trustData.append("type", "trust_survey");
            trustData.append("github", formData.github || "");

            await fetch(FORMSPREE_URL, {
                method: "POST",
                body: trustData,
                headers: { Accept: "application/json" },
            });
        } catch (err) {
            // no-op: 설문 전송 실패는 UI에 표시하지 않음
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const isFormValid = formData.github.trim() !== "" && formData.content.trim() !== "" && formData.email.trim() !== "" && formData.source !== "";

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus("");

        const data = new FormData();
        data.append("github", formData.github);
        data.append("content", formData.content);
        data.append("email", formData.email);
        data.append("source", formData.source);
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
                setLastSubmittedEmail(formData.email);
                setFormData({ github: "", content: "", email: "", source: "" });
                setShowTrustModal(true);
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
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">AI 피드백 요청하기</h1>
                    <p className="text-gray-600">AI에게 코드 피드백을 받아보세요!</p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 mb-6">
                    <div className="flex justify-end mb-4">
                        <button
                            type="button"
                            onClick={() => setShowExampleModal(true)}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            예시 보기
                        </button>
                    </div>
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
                                피드백 받고 싶은 내용
                            </label>
                            <textarea
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleInputChange}
                                placeholder="어떤 부분에 대한 리뷰를 받고 싶으신가요? (예: 코드 품질, 폴더 구조, 아키텍처, 성능 최적화, 보안 등 구체적으로 설명해주세요)"
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

                        {/* Source Select */}
                        <div className="space-y-2">
                            <label htmlFor="source" className="block text-sm font-medium text-gray-700">
                                방문 경로
                            </label>
                            <div className="relative">
                                <select
                                    id="source"
                                    name="source"
                                    value={formData.source}
                                    onChange={handleInputChange}
                                    required
                                    className="block w-full px-3 py-3 pr-10 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out appearance-none bg-white cursor-pointer"
                                >
                                    <option value="">방문 경로를 선택해주세요</option>
                                    <option value="sns">SNS</option>
                                    <option value="openchat">오픈채팅</option>
                                    <option value="blog">블로그</option>
                                    <option value="cafe">카페</option>
                                    <option value="other">기타</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </form>

                    {status === "success" && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <div>
                                    <p className="text-sm text-green-800">제출 완료! 제출해주신 이메일로 최대한 빠른 피드백을 드릴게요!</p>
                                    {/* {feedbackType === "premium" && <p className="text-xs text-green-700 mt-1">💡 시범운영 중으로 실제 결제는 진행되지 않습니다.</p>} */}
                                </div>
                            </div>
                        </div>
                    )}
                    {status === "error" && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <div>
                                    <p className="text-sm text-red-800">제출 실패! 다시 시도해주세요.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Pricing Selection */}
                {/* <div className="bg-white rounded-2xl shadow-xl p-4 mb-6 border border-gray-100">
                    <h2 className="text-base font-semibold text-gray-800 mb-3 text-center">피드백 유형 선택</h2>
                    <div className="grid grid-cols-1 gap-3">
                        <button
                            type="button"
                            onClick={() => setFeedbackType("free")}
                            className={`p-3 rounded-lg border-2 ${feedbackType === "free" ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-gray-50"}`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-800 text-sm">무료 피드백</h3>
                                    <p className="text-xs text-gray-600">핵심 요약 피드백</p>
                                </div>
                                <span className="text-lg font-bold text-green-600">₩0</span>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setFeedbackType("premium")}
                            className={`p-3 rounded-lg border-2 ${feedbackType === "premium" ? "border-purple-500 bg-purple-50" : "border-gray-200 bg-gray-50"}`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-800 text-sm">일반 피드백</h3>
                                    <p className="text-xs text-gray-600">상세 전체 피드백</p>
                                </div>
                                <span className="text-lg font-bold text-purple-600">₩4,900</span>
                            </div>
                        </button>
                    </div>
                </div> */}

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

            {/* Example Modal */}
            {showExampleModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">예시 보기</h2>
                            <button onClick={() => setShowExampleModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">GitHub 저장소 주소 (Public)</label>
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <p className="text-gray-800 break-all overflow-hidden">https://github.com/example/my-project</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">피드백 받고 싶은 내용</label>
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <p className="text-gray-800 break-words overflow-hidden">
                                        현재 TypeScript 프로젝트의 타입 안전성과 코드 품질에 대한 피드백을 받고 싶습니다. 특히 tsconfig.json 설정, any 타입 사용, ESLint 규칙 등에서 개선이 필요한
                                        부분이 있는지 확인해주세요.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">이메일 주소</label>
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <p className="text-gray-800 break-all overflow-hidden">example@email.com</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">방문 경로</label>
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <p className="text-gray-800 break-words overflow-hidden">SNS</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">📝 AI 피드백 예시</h3>
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-medium text-gray-800 mb-2">🚨 심각한 문제점들</h4>
                                        <div className="space-y-3">
                                            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                                                <h5 className="font-medium text-red-800 mb-1">1. TypeScript 설정이 너무 느슨함</h5>
                                                <p className="text-xs text-red-700 mb-2">tsconfig.json</p>
                                                <code className="text-xs bg-red-100 p-1 rounded block mb-2 break-all overflow-hidden">"strict": false, "noImplicitAny": false</code>
                                                <ul className="text-xs text-red-700 space-y-1">
                                                    <li>• strict: false와 noImplicitAny: false로 설정되어 있어 TypeScript의 타입 안전성 장점을 거의 활용하지 못함</li>
                                                    <li>• 런타임 에러를 컴파일 타임에 잡을 수 없음</li>
                                                </ul>
                                            </div>

                                            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                                                <h5 className="font-medium text-red-800 mb-1">2. 과도한 any 타입 사용</h5>
                                                <p className="text-xs text-red-700 mb-2">api.ts</p>
                                                <code className="text-xs bg-red-100 p-1 rounded block mb-2 break-all overflow-hidden">
                                                    get: (url: string, config?: any) =&gt; api.get(url, config).then((res: any) =&gt; res.data)
                                                </code>
                                                <ul className="text-xs text-red-700 space-y-1">
                                                    <li>• API 응답 타입이 any로 되어 있어 타입 안전성 부족</li>
                                                    <li>• 컴포넌트 props에서도 any 타입 사용</li>
                                                </ul>
                                            </div>

                                            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                                                <h5 className="font-medium text-red-800 mb-1">3. ESLint 규칙이 너무 느슨함</h5>
                                                <p className="text-xs text-red-700 mb-2">eslint.config.mjs</p>
                                                <code className="text-xs bg-red-100 p-1 rounded block mb-2 break-all overflow-hidden">
                                                    "@typescript-eslint/no-explicit-any": "off", "@typescript-eslint/no-unused-vars": "off"
                                                </code>
                                                <ul className="text-xs text-red-700 space-y-1">
                                                    <li>• 중요한 타입 체크와 사용하지 않는 변수 경고를 모두 비활성화</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button onClick={() => setShowExampleModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showTrustModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-[fadeIn_.15s_ease-out]">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                                    </svg>
                                </div>
                                <h3 className="text-base font-semibold text-gray-900">평소에 AI를 얼마나 신뢰하시나요?</h3>
                            </div>
                            <button type="button" onClick={() => setShowTrustModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="신뢰도 모달 닫기">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-5">1(전혀 아님) ~ 5(매우 신뢰) 중에서 선택해주세요.</p>
                        <div className="flex items-center justify-between gap-2 mb-5">
                            {[1, 2, 3, 4, 5].map((n) => (
                                <button
                                    key={n}
                                    type="button"
                                    onClick={() => handleTrustSelect(n)}
                                    className={`w-11 h-11 rounded-full border text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
                                        trustScore === n ? "bg-blue-600 text-white border-blue-600 shadow" : "bg-white text-gray-800 border-gray-300 hover:bg-blue-50"
                                    }`}
                                    aria-label={`신뢰도 ${n}점 선택`}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                        <button type="button" onClick={() => setShowTrustModal(false)} className="w-full py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm">
                            잠시 후에 답할게요
                        </button>
                    </div>
                </div>
            )}
            {showThanksModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-[fadeIn_.15s_ease-out] text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white mb-3 shadow">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">감사합니다!</h3>
                        <p className="text-sm text-gray-600 mb-5">소중한 의견이 서비스 개선에 큰 도움이 됩니다.</p>
                        <button type="button" onClick={() => setShowThanksModal(false)} className="w-full py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm">
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
