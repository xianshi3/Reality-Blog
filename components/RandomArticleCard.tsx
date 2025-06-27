"use client";

import { useState, useEffect } from 'react';
import type { Article } from '../types/article';

interface RandomArticleCardProps {
  articles: Article[];
}

export default function RandomArticleCard({ articles }: RandomArticleCardProps) {
  const [randomArticle, setRandomArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const getRandomArticle = () => {
    if (articles.length === 0) return;
    
    setIsLoading(true);
    setShowAnswer(false);
    setIsFlipping(true);
    setIsSpinning(true); // 触发旋转
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * articles.length);
      const selectedArticle = articles[randomIndex];
      
      const articleWithSafeTags = {
        ...selectedArticle,
        tags: Array.isArray(selectedArticle.tags) ? selectedArticle.tags : []
      };
      
      setRandomArticle(articleWithSafeTags);
      setIsLoading(false);
      setTimeout(() => {
        setIsFlipping(false);
        setIsSpinning(false); // 停止旋转
      }, 300);
    }, 800);
  };

  useEffect(() => {
    getRandomArticle();
  }, [articles]);

  const renderTags = () => {
    if (!randomArticle?.tags || randomArticle.tags.length === 0) {
      return '暂无标签';
    }
    return randomArticle.tags.join(' · ');
  };

  return (
    <div className={`bg-white dark:bg-[#23272f] rounded-2xl p-6 font-sans shadow-md border-gray-200 dark:border-gray-700 transition-all duration-300 ${isFlipping ? 'scale-95 opacity-90' : 'scale-100 opacity-100'}`}>
      <h3 className="text-xl font-bold mb-4 flex items-center text-gray-800 dark:text-gray-100">
        <span className={`mr-2 ${isSpinning ? 'animate-spin' : ''}`}>🎲</span> 
        随机文章挑战
      </h3>
      
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-300 transition-opacity duration-200">
          看看今天为你推荐什么文章？
        </p>
        
        {isLoading ? (
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        ) : randomArticle ? (
          <>
            {!showAnswer ? (
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800 transition-all duration-300">
                <p className="text-blue-600 dark:text-blue-300 font-medium animate-fadeIn">
                  猜猜这篇文章关于什么？
                </p>
                <p className="text-sm mt-2 text-gray-600 dark:text-gray-300 transition-opacity delay-75">
                  标签: {renderTags()}
                </p>
                <p className="text-sm mt-1 text-gray-600 dark:text-gray-300 transition-opacity delay-100">
                  分类: {randomArticle.category || '未分类'}
                </p>
              </div>
            ) : (
              <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-800 animate-flipIn">
                <h4 className="font-bold text-green-600 dark:text-green-300 animate-fadeIn delay-150">
                  {randomArticle.title}
                </h4>
                <p className="text-sm mt-2 text-gray-700 dark:text-gray-200 animate-fadeIn delay-200">
                  {randomArticle.summary || '暂无摘要'}
                </p>
                <p className="text-xs mt-2 text-gray-500 dark:text-gray-400 animate-fadeIn delay-300">
                  发布日期: {randomArticle.date}
                </p>
              </div>
            )}
            
            <div className="flex gap-3 pt-2">
              {!showAnswer ? (
                <button
                  onClick={() => {
                    setShowAnswer(true);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white dark:text-gray-100 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:opacity-90 active:opacity-80"
                >
                  揭晓答案
                </button>
              ) : (
                <a
                  href={randomArticle.link}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white dark:text-gray-100 py-2 px-4 rounded-lg text-sm font-medium text-center transition-all duration-200 shadow-sm hover:opacity-90 active:opacity-80"
                >
                  阅读全文
                </a>
              )}
              <button
                onClick={getRandomArticle}
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:opacity-90 active:opacity-80"
              >
                换一篇
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500 dark:text-gray-300 animate-fadeIn">暂无文章数据</p>
        )}
      </div>
    </div>
  );
}