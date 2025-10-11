'use client';
import Link from 'next/link';
import { FaPen } from 'react-icons/fa';
import { FaEllipsisVertical } from 'react-icons/fa6';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { ICategory } from '~/types/category';
import { usePopup } from '~/utils/toggle-popups';
import { useState } from 'react';
import DeleteCategoryPrompt from './delete-category-prompt';
import { useAuthContext } from '~/app/context/auth-context';
import EditCategoryPrompt from './edit-category-prompt';
interface CategoryProps {
	category: ICategory;
	admin?: boolean;
	classname_override?: string;
}

const CategoryCard = ({
	category,
	admin = false,
	classname_override,
}: CategoryProps) => {
	const {
		isActive: adminPrompt,
		isVisible: adminPromptVisible,
		ref: adminPromptRef,
		togglePopup: toggleAdminPrompt,
	} = usePopup();
	const {
		isActive: editCategoryPrompt,
		isVisible: editCategoryPromptVisible,
		ref: editCategoryPromptRef,
		setDisableToggle: disableEditCategoryPrompt,
		togglePopup: toggleEditCategoryPrompt,
	} = usePopup();
	const {
		isActive: deleteCategoryPrompt,
		isVisible: deleteCategoryPromptVisible,
		ref: deleteCategoryPromptRef,
		setDisableToggle: disableDeleteCategoryPrompt,
		togglePopup: toggleDeleteCategoryPrompt,
	} = usePopup();
	const [categoryToEdit, setCategoryToEdit] = useState<ICategory | null>(null);
	const { user } = useAuthContext();
	return (
		<>
			<Link
				href={
					admin
						? `/admin/categories/${category?.slug}`
						: `/categories/${category?.slug}`
				}
				className={`${
					classname_override ??
					'flex flex-col items-start overflow-hidden    hover:shadow-md duration-300   max-xs:gap-2  max-2xs:h-auto rounded-lg relative border border-grey'
				}      `}
			>
				{admin && (
					<div className="absolute top-3 right-3 z-20">
						{user?.role === 'super_admin' && (
							<button
								className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-[#ffffff43]  "
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									toggleAdminPrompt();
								}}
							>
								<FaEllipsisVertical className="text-xl text-white" />
							</button>
						)}
						{adminPrompt && (
							<div
								className={`flex  flex-col bg-navy shadow-lg  w-[150px] rounded-md   duration-150 absolute top-0 right-[100%] divide-y divide-grey overflow-hidden border border-grey z-20   ${
									adminPromptVisible ? 'opacity-100' : 'opacity-0 '
								}`}
								ref={adminPromptRef}
							>
								<button
									className="py-2 w-full text-[13px]  text-silver flex items-center gap-2  px-3 hover:bg-deepBlue duration-150"
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										toggleEditCategoryPrompt();
										setCategoryToEdit(category);
									}}
								>
									<FaPen className="text-sm" />
									<span>Edit category</span>
								</button>
								<button
									className="py-2 w-full text-[13px]  text-silver flex items-center gap-2  px-3 hover:bg-deepBlue duration-150"
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										toggleDeleteCategoryPrompt();
									}}
								>
									<RiDeleteBin5Line className="text-sm" />
									<span>Delete category</span>
								</button>
							</div>
						)}
					</div>
				)}

				<div className=" w-full overflow-hidden  blog-img relative   max-2xs:max-h-auto max-2xs:min-h-[200px]">
					{/* eslint-disable-next-line */}
					<img
						src={category?.image}
						alt={category?.image || 'category image'}
						className="w-full h-full object-cover min-h-[200px]"
					/>
					<div className="absolute top-0 left-0 h-full w-full bg-[#15133d7a] min-h-[200px]"></div>
					<h3 className="  text-white text-2xl rounded-sm absolute  bottom-2 left-5 font-semibold  max-2xs:px-2 max-2xs:text-2xl poppins-bold capitalize">
						{category?.title}
					</h3>
				</div>
				<div className="p-6 max-md:p-3">
					<p className="text-silver text-base line-clamp-3 article-desc max-md:text-sm max-2xs:text-sm  ">
						{category?.description}
					</p>
				</div>
			</Link>

			<EditCategoryPrompt
				isVisible={editCategoryPromptVisible}
				ref={editCategoryPromptRef}
				isActive={editCategoryPrompt}
				togglePopup={toggleEditCategoryPrompt}
				setDisable={disableEditCategoryPrompt}
				categoryToEdit={categoryToEdit as ICategory}
			/>
			<DeleteCategoryPrompt
				isVisible={deleteCategoryPromptVisible}
				ref={deleteCategoryPromptRef}
				isActive={deleteCategoryPrompt}
				togglePopup={toggleDeleteCategoryPrompt}
				setDisable={disableDeleteCategoryPrompt}
				categoryId={category?._id}
			/>
		</>
	);
};

export default CategoryCard;

