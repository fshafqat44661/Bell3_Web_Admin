import React, {useState} from "react";
import Textinput from "@/components/ui/Textinput";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import axios from "axios";
import * as yup from "yup";
import {toast} from "react-toastify";

const FormValidationSchema = yup
    .object({
        word: yup.string().required("Word is Required"),
    })
    .required();

const NewBadwordForm = ({closeModal}) => {
    const [errorMessage, setErrorMessage] = useState("")
    const [loading, setLoading] = useState(false)

    const {
        register,
        formState: {errors},
        handleSubmit,
        reset
    } = useForm({
        resolver: yupResolver(FormValidationSchema),
        mode: "all",
    });

    const onSubmit = async (data) => {
        console.log(data);
        try {
            setLoading(true)
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BELL3_API_URL}admin/badwords`, {
                word: data.word,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                }
            })
            console.log('Response:', response);
            if (response.status == 201 || response.status == 201) {
                closeModal()
                toast.success(response.data.message, {
                    position: "top-right",
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                reset()
                //reload page
                window.location.reload()
            }

        } catch (e) {
            setErrorMessage(e.response.data.message)
            console.log(e)
        } finally {
            setLoading(false)
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
                <Textinput
                    placeholder="Add your word"
                    name="word"
                    label="Word"
                    type="text"
                    register={register}
                    error={errors.word}
                />

                <div className="ltr:text-right rtl:text-left">
                    <button  className={`btn btn-dark text-center ${loading? 'bg-gray-200 cursor-not-allowed' : ''}`} >Submit</button>
                </div>
                {errorMessage && (
                    <div className={"text-red-500"}>
                        <p>{errorMessage}</p>
                    </div>
                )}
            </form>
        </div>
    );
};

export default NewBadwordForm;
