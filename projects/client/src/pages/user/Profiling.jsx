import React from "react";
import Button from "../../components/buttons/Button"
import TextInput from "../../components/forms/TextInput";

function Profiling() {
    return (
        <>
            <div className="flex">
                <div className="pt-3 pl-5 block text-gray-500 font-bold">My Profile</div>
            </div>
            <div className="flex justify-center">
                <div className="">
                    <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="profile" className="w-32 rounded-full	" />
                </div>
            </div>
            <div className="flex justify-center">
                <div className="p-4">
                    <Button label={'Update Photo Profile'}></Button>
                </div>
            </div>
            <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                    <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="inline-full-name">
                        Name
                    </label>
                </div>
                <div className="md:w-1/3">
                    <TextInput placeholder={'Full Name'} value={''} />
                </div>
            </div>
            <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                    <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="inline-full-name">
                        Gender
                    </label>
                </div>
                <div className="md:w-1/3">
                    <TextInput placeholder={'Gender'} value={''} />
                </div>
            </div>
            <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                    <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="inline-full-name">
                        Birth Date
                    </label>
                </div>
                <div className="md:w-1/3">
                    <TextInput placeholder={'Birth Date '} value={''} />
                </div>
            </div>
            <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                    <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="inline-full-name">
                        Phone
                    </label>
                </div>
                <div className="md:w-1/3">
                    <TextInput placeholder={'Phone Number'} value={''} />
                </div>
            </div>
            <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                    <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="inline-full-name">
                        Email
                    </label>
                </div>
                <div className="md:w-1/3">
                    <TextInput placeholder={'Email'} value={''} />
                </div>
            </div>
            <div className="flex justify-center">
                <div className="p-4">
                    <Button label={'Save Changes'}></Button>
                </div>
            </div>

            <hr className="w-48 h-1 mx-auto my-4 bg-gray-900 border-0 rounded" />
            <div className="flex justify-center py-6">
                <p className="font-bold">* If You Change Your Password, You Will Need To Re-Login</p>
            </div>
            <div className="flex justify-center">
                <div className="flex md:items-center mb-6">
                    <div className="w-full">
                        <TextInput type={"password"} label={"Password"} placeholder={'Old Password'} value={''} />
                    </div>
                </div>
            </div>
            <div className="flex justify-center">
                <div className="flex md:items-center mb-6">
                    <div className="w-full">
                        <TextInput type={"password"} label={"New Password"} placeholder={'New Password'} value={''} />
                    </div>
                </div>
            </div>
            <div className="flex justify-center">
                <div className="flex md:items-center mb-6">
                    <div className="w-full">
                        <TextInput type={"password"} label={"Confirm New Password"} placeholder={'Confirm New Password'} value={''} />
                    </div>
                </div>
            </div>
            <div className="flex justify-center">
                <div className="p-4">
                    <Button label={'Change Password'}></Button>
                </div>
            </div>
        </>
    );
}

export default Profiling;
