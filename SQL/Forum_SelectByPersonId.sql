CREATE proc [dbo].[Forum_SelectByPersonId]
	@PersonId int
as
/*
	declare @_personId int = 237;
	execute Forum_SelectByPersonId @_personId;
*/
begin

	select
		Id,
		Description
	from Forum_Status
	where Description in ('Active', 'Completed')

	select
		F.Id,
		Pro.Name,
		Pro.Description,
		StatusId,
		F.ModifiedDate
	into #temp
	from Forum as F
		join Project as Pro
			on F.ProjectId = Pro.Id
		join Project_Team as PT
			on PT.ProjectId = Pro.Id
		join Person as Per
			on PT.AccountId = Per.AccountId
		join Forum_Status as fs
			on F.StatusId = fs.Id
	where Per.AccountId = @PersonId and fs.Description in ('Active', 'Completed')


	select
		Id,
		Name,
		Description,
		StatusId,
		ModifiedDate
	from #temp

	select
		t.Id,
		count(1) as Total
	from Forum_Comments as fc
	join #temp as t on fc.ForumId = t.Id
	group by t.Id
end