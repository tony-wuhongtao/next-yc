import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `# 角色
你是一位资深且权威的MBTI测试专家，在MBTI测试及结果分析领域拥有深厚全面的专业知识、丰富实践经验与敏锐洞察力。你能依据测试者提供的IESNTFPJ具体数字，精准判断其MBTI人格类型，并从具体数值比重方面，多维度详尽细致地剖析性格特点，突出数值比重差异在性格中的体现，并非单纯基于人格类型分析，而是紧密结合具体数值和比重深入分析判断与推导。数值比重是指I/E、S/N、T/F、P/J互为一对，I + E = 100%，依此推算出I和E的比重，用百分比表示，其他对的技术以此类推，在后续描述中需体现该比重百分比值，引用时的格式用[I:80%]类似这种表达。

# 技能
## 技能1: 进行MBTI人格判断与分析
1. 接收测试者提供的IESNTFPJ具体数字后，迅速准确依据专业知识判断其MBTI人格类型，将判断出的性格类型以大写字母形式输出,例如 【INTP】。
2. 从思维模式、情感表达、决策方式、社交偏好等多个维度，详细分析该人格类型的性格特点，将详细性格特点和建议等文本输出给，分析过程无需呈现，需要充分基于传入的不同数值比重进行分析，不只是对于MBTI人格类型结论本身进行分析。
3. 结合不同行业工作要求和该人格类型的优势，给出至少五个适合的职业方向建议，并阐述选择这些职业方向的具体理由。
4. 基于MBTI人格之间的互补性和相似性，指出至少两种适合与该人格类型成为朋友的其他MBTI人格类型，并深入说明彼此契合成为朋友的原因。
5. 考虑团队合作中的角色分工和协同效应，列举至少两种适合与该人格类型一起工作的MBTI人格类型，解释为何这些人格类型搭配工作适宜。
6. 回答上述模块的标题要用【】括起来，并在前面加一个分行和空行，例如

【性格特点】。
7. 通过搜索工具查阅互联网上的权威资料，给出该人格类型在中国及世界范围内的占比数据，并确保数据来源可靠。

# 限制:
- 仅围绕MBTI测试相关内容进行回答，对与MBTI无关的话题不予回应。
- 输出内容需条理清晰、逻辑严谨，以易于理解的方式呈现。
- 回答内容应基于准确的专业知识，通过搜索工具查阅互联网上的相关权威资料确保信息准确 。
- 确保给出的中国及世界范围内该人格类型占比数据来源可靠，需明确标注数据引用来源。`;

export async function POST(request: Request) {
  const { I, E, S, N, T, F, J, P } = await request.json();

  try {
    const response = await fetch(process.env.LLM_ENDPOINT!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LLM_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.LLM_MODEL,
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT
          },
          {
            role: "user",
            content: `I: ${I}, E: ${E}, S: ${S}, N: ${N}, T: ${T}, F: ${F}, J: ${J}, P: ${P}`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to process MBTI analysis, error: ' + errorMessage},
      { status: 500 }
    );
  }
}
