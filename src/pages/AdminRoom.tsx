import { useParams, useNavigate } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';
import deleteImage from '../assets/images/delete.svg';

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
// import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';

import '../styles/room.scss';

export function AdminRoom() {
    const navigate = useNavigate();
    const params = useParams();
    // const { user } = useAuth();
    const { questions, title } = useRoom(params.id);

    async function handleEndRoom() {
        await database.ref(`rooms/${params.id}`).update({
            endedAt: new Date()
        });

        navigate('/');
    }

    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm('Are you sure you want to delete this question?')) {
            await database.ref(`rooms/${params.id}/questions/${questionId}`).remove();
        }
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask Logo" />
                    <div>
                        <RoomCode code={params.id} />
                        <Button
                            onClick={handleEndRoom}
                            isOutlined
                        >
                            Encerrar sala
                        </Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>

                <div className="question-list">
                    {questions.map((question, index) => (
                        <Question
                            key={index}
                            content={question.content}
                            author={question.author}
                        >
                            <button
                                type="button"
                                onClick={() => handleDeleteQuestion(question.id)}
                            >
                                <img src={deleteImage} alt="Remover Pergunta" />
                            </button>
                        </Question>
                    ))}
                </div>
            </main>
        </div>
    );
}