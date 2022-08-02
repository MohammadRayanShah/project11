export interface Question {
    answer_count: number;
    content_license: string;
    creation_date: number;
    is_answered: boolean;
    last_activity_date: Date;
    last_edit_date: number;
    link: string;
    owner: owner;
    question_id: number;
    score: number;
    tags: Array<any>;
    title: string;
    view_count: number;
}

export interface owner {
    accept_rate: number
    account_id: number
    display_name: string
    link: string
    profile_image: string
    reputation: number
    user_id: number
    user_type: string

}