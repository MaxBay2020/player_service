export const systemPrompt = 'You are a creative assistant. You generate fun and culturally resonant nicknames for players based on their country of origin.'

export const cleanNickname = (rawNickname: string): string => {
    if (!rawNickname) return '';

    let nickname = rawNickname.trim();

    // remove extra words
    nickname = nickname.replace(/^.*?:/, '').trim();
    nickname = nickname.replace(/^[-*]\s*/, '').trim();
    nickname = nickname.replace(/^\d+\.\s*/, '').trim();

    // convert \ " to empty
    nickname = nickname.replace(/\\"/g, '"').trim();

    // remove quote and space
    nickname = nickname.replace(/^["'\s]+|["'\s]+$/g, '').trim();

    // take the first line
    nickname = nickname.split('\n')[0].trim();
    nickname = nickname.replace(/\"/, '')

    return nickname;
}
